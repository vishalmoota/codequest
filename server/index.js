require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const ChatMessage = require('./models/ChatMessage');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const io = new Server(server, { 
  cors: { origin: clientOrigin, credentials: true },
  transports: ['websocket', 'polling']
});

// Initialize app middleware before connecting to DB
app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROUTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/courses',      require('./routes/courses'));
app.use('/api/challenges',   require('./routes/challenges'));
app.use('/api/leaderboard',  require('./routes/leaderboard'));
app.use('/api/profile',      require('./routes/profile'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/narrative',    require('./routes/narrative'));
app.use('/api/projects',     require('./routes/projects'));
app.use('/api/user-projects', require('./routes/userProjects'));
app.use('/api/project-progress', require('./routes/projectProgress'));
app.use('/api/nites-of-coding', require('./routes/nitesOfCoding'));
app.use('/api/run-code',     require('./routes/runCode'));
app.use('/api/comments',     require('./routes/comments'));
app.use('/api/community',    require('./routes/community'));
app.use('/api/chat',         require('./routes/chat'));

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SOCKET.IO SETUP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const onlineUsers = new Map();

const getRoomUsers = (room) => {
  const users = [];
  onlineUsers.forEach(v => { 
    if (v.room === room) users.push(v); 
  });
  return users;
};

// Socket.io middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const username = socket.handshake.auth.username;
  const avatar = socket.handshake.auth.avatar;
  
  if (!username) {
    return next(new Error('Username is required'));
  }
  
  socket.username = username;
  socket.avatar = avatar || '🧑‍💻';
  socket.userId = socket.handshake.auth.userId;
  
  next();
});

io.on('connection', (socket) => {
  console.log(`User ${socket.username} connected: ${socket.id}`);

  socket.on('chat:join', async ({ room, username, avatar, rank, userId }) => {
    try {
      // Leave previous room
      const prev = onlineUsers.get(socket.id);
      if (prev?.room) {
        socket.leave(prev.room);
        io.to(prev.room).emit('chat:user_left', { username: prev.username });
        io.to(prev.room).emit('chat:online', getRoomUsers(prev.room));
      }

      // Join new room
      socket.join(room);
      socket.currentRoom = room;
      
      const userData = {
        username,
        avatar: avatar || '🧑‍💻',
        rank: rank || 'Bronze',
        room,
        userId: userId || null,
        socketId: socket.id
      };
      
      onlineUsers.set(socket.id, userData);

      // Send chat history to the user
      const history = await ChatMessage.find({ room })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      socket.emit('chat:history', history.reverse());

      // Notify room that user joined
      io.to(room).emit('chat:message', {
        _id: new Date().toString(),
        room,
        username: 'System',
        text: `${username} joined #${room}`,
        type: 'join',
        createdAt: new Date(),
        avatar: '🤖',
        rank: 'System'
      });

      // Update online users list for everyone in room
      io.to(room).emit('chat:online', getRoomUsers(room));
      
      console.log(`${username} joined room: ${room}`);
    } catch (error) {
      console.error('Error in chat:join:', error);
      socket.emit('error', 'Failed to join room');
    }
  });

  socket.on('chat:send', async ({ room, text, userId, username }) => {
    try {
      const user = onlineUsers.get(socket.id);
      if (!user || !text?.trim()) {
        return socket.emit('error', 'Invalid message');
      }

      const messageData = {
        room,
        userId: user.userId || userId,
        username: user.username,
        avatar: user.avatar || '🧑‍💻',
        rank: user.rank || 'Bronze',
        text: text.trim().slice(0, 500),
        type: 'message',
        createdAt: new Date()
      };

      // Save to database
      const saved = await ChatMessage.create(messageData);

      // Broadcast to everyone in room
      io.to(room).emit('chat:message', {
        ...messageData,
        _id: saved._id,
        createdAt: saved.createdAt
      });

      console.log(`Message from ${user.username} in ${room}: ${text.slice(0, 30)}...`);
    } catch (error) {
      console.error('Error in chat:send:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  socket.on('chat:typing', ({ room }) => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      socket.to(room).emit('chat:typing', { username: user.username });
    }
  });

  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user?.room) {
      io.to(user.room).emit('chat:message', {
        _id: new Date().toString(),
        room: user.room,
        username: 'System',
        text: `${user.username} left #${user.room}`,
        type: 'leave',
        createdAt: new Date(),
        avatar: '🤖',
        rank: 'System'
      });
      io.to(user.room).emit('chat:online', getRoomUsers(user.room));
      console.log(`${user.username} left room: ${user.room}`);
    }
    onlineUsers.delete(socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// START SERVER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    console.log('✅ Database connected successfully');

    // Then start the server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 CodeQuest server running on port ${PORT}`);
      console.log(`📡 Socket.io ready for real-time communication`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
