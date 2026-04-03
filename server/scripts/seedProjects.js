require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('✅ DB Connected — seeding projects...');
  await Project.deleteMany({});

  const projects = [
    {
      title: 'Build a To-Do List App',
      slug: 'todo-list-app',
      description: 'Create a fully functional to-do list with add, complete, and delete features using vanilla JavaScript.',
      longDescription: 'Master DOM manipulation, event listeners, and localStorage as you build a real productivity app from scratch.',
      category: 'JavaScript', difficulty: 'Beginner', group: 'beginner',
      emoji: '📝', gradient: 'from-emerald-500 to-teal-600',
      tags: ['DOM', 'Events', 'localStorage'], xpReward: 150,
      estimatedTime: '45 min', featured: true,
      prerequisites: ['Variables', 'Functions', 'DOM basics'],
      whatYoullLearn: ['DOM manipulation', 'Event listeners', 'localStorage API', 'Array methods'],
      theory: `## The DOM & JavaScript\nThe Document Object Model (DOM) is a programming interface for web documents. JavaScript can change all the HTML elements, attributes, and CSS styles in the page.\n\n### Key Concepts:\n- **querySelector** — select elements like CSS selectors\n- **addEventListener** — respond to user interactions\n- **localStorage** — persist data in the browser\n- **Array.filter()** — remove completed/deleted items`,
      steps: [
        { stepNum: 1, title: 'Set up HTML Structure', language: 'html', hint: 'Create a form with an input and button, plus an empty ul for the list.',
          explanation: 'Start with the skeleton HTML. You need an input for new tasks, a button to add them, and a list to display them.',
          code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Todo App</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <div class="container">\n    <h1>📝 My Tasks</h1>\n    <div class="input-group">\n      <input id="taskInput" placeholder="Add a new task..." />\n      <button id="addBtn">Add</button>\n    </div>\n    <ul id="taskList"></ul>\n  </div>\n  <script src="app.js"></script>\n</body>\n</html>` },
        { stepNum: 2, title: 'Style with CSS', language: 'css', hint: 'Use flexbox for the input group and a card-shadow for the container.',
          explanation: 'Add styles to make your app look clean and professional. Focus on flexbox layouts and smooth transitions.',
          code: `* { box-sizing: border-box; margin: 0; padding: 0; }\nbody { font-family: 'Inter', sans-serif; background: #0f0f1a; display: flex; justify-content: center; padding: 40px 16px; }\n.container { background: #1a1a2e; border-radius: 16px; padding: 32px; width: 100%; max-width: 500px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }\nh1 { color: #e2e8f0; margin-bottom: 24px; font-size: 1.5rem; }\n.input-group { display: flex; gap: 8px; margin-bottom: 20px; }\ninput { flex: 1; padding: 12px 16px; border-radius: 10px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; font-size: 14px; }\nbutton { padding: 12px 20px; background: #6366f1; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; }\nbutton:hover { background: #4f46e5; }\nli { list-style: none; display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; background: #0f172a; margin-bottom: 8px; }\nli.done span { text-decoration: line-through; opacity: 0.5; }\n.del { margin-left: auto; cursor: pointer; color: #ef4444; font-size: 18px; }` },
        { stepNum: 3, title: 'Write the JavaScript Logic', language: 'javascript', hint: 'Use document.getElementById() to grab elements, then addEventListener for the button.',
          explanation: 'Now the magic happens! Connect your HTML elements to JavaScript functions that add, complete, and delete tasks.',
          code: `const input = document.getElementById('taskInput');\nconst addBtn = document.getElementById('addBtn');\nconst list = document.getElementById('taskList');\n\nlet tasks = JSON.parse(localStorage.getItem('tasks') || '[]');\nrenderAll();\n\naddBtn.addEventListener('click', addTask);\ninput.addEventListener('keydown', e => e.key === 'Enter' && addTask());\n\nfunction addTask() {\n  const text = input.value.trim();\n  if (!text) return;\n  tasks.push({ id: Date.now(), text, done: false });\n  input.value = '';\n  save(); renderAll();\n}\n\nfunction toggleTask(id) {\n  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);\n  save(); renderAll();\n}\n\nfunction deleteTask(id) {\n  tasks = tasks.filter(t => t.id !== id);\n  save(); renderAll();\n}\n\nfunction renderAll() {\n  list.innerHTML = '';\n  tasks.forEach(t => {\n    const li = document.createElement('li');\n    if (t.done) li.classList.add('done');\n    li.innerHTML = \`<input type="checkbox" \${t.done ? 'checked' : ''}>\n      <span>\${t.text}</span>\n      <span class="del" onclick="deleteTask(\${t.id})">🗑️</span>\`;\n    li.querySelector('input').addEventListener('change', () => toggleTask(t.id));\n    list.appendChild(li);\n  });\n}\n\nfunction save() {\n  localStorage.setItem('tasks', JSON.stringify(tasks));\n}` },
        { stepNum: 4, title: 'Add Task Count & Filter', language: 'javascript', hint: 'Count tasks with .filter(t => !t.done).length for incomplete count.',
          explanation: 'Add a task counter and filter buttons to show All / Active / Completed tasks. This is a great UX enhancement!',
          code: `// Add after renderAll:\nfunction renderAll() {\n  // ... existing code ...\n  const active = tasks.filter(t => !t.done).length;\n  document.getElementById('count').textContent =\n    \`\${active} task\${active !== 1 ? 's' : ''} remaining\`;\n}` }
      ]
    },
    {
      title: 'Build a Calculator',
      slug: 'javascript-calculator',
      description: 'Build a working calculator with keyboard support, operation history, and a sleek dark UI.',
      longDescription: 'Practice functions, string parsing, and event handling as you create a real calculator app.',
      category: 'JavaScript', difficulty: 'Beginner', group: 'beginner',
      emoji: '🧮', gradient: 'from-blue-500 to-indigo-600',
      tags: ['Functions', 'Events', 'Math'], xpReward: 120,
      estimatedTime: '30 min', featured: false,
      prerequisites: ['Variables', 'Functions', 'Conditionals'],
      whatYoullLearn: ['String evaluation', 'Keyboard events', 'CSS Grid for layouts', 'Error handling'],
      theory: `## Building a Calculator\nUnderstand how to use JavaScript's \`eval()\` safely, handle operator precedence, and manage UI state.\n\n### Key Concepts:\n- **eval()** — evaluates a string as JavaScript (use carefully)\n- **Keyboard events** — keydown event with key codes\n- **Error handling** — try/catch for invalid expressions`,
      steps: [
        { stepNum: 1, title: 'HTML & CSS Grid Layout', language: 'html', hint: 'Use CSS Grid with repeat(4, 1fr) to create the button matrix.',
          explanation: 'Design the calculator layout using CSS Grid. Each row has 4 columns.',
          code: `<div class="calc">\n  <div id="display">0</div>\n  <div class="buttons">\n    <button onclick="clear()">C</button>\n    <button onclick="append('%')">%</button>\n    <button onclick="del()">⌫</button>\n    <button class="op" onclick="append('/')">÷</button>\n    <!-- number rows -->\n    <button onclick="append('7')">7</button>\n    <button onclick="append('8')">8</button>\n    <button onclick="append('9')">9</button>\n    <button class="op" onclick="append('*')">×</button>\n    <button onclick="append('4')">4</button>\n    <button onclick="append('5')">5</button>\n    <button onclick="append('6')">6</button>\n    <button class="op" onclick="append('-')">−</button>\n    <button onclick="append('1')">1</button>\n    <button onclick="append('2')">2</button>\n    <button onclick="append('3')">3</button>\n    <button class="op" onclick="append('+')">+</button>\n    <button style="grid-column:span 2" onclick="append('0')">0</button>\n    <button onclick="append('.')">.</button>\n    <button class="eq" onclick="calculate()">=</button>\n  </div>\n</div>` },
        { stepNum: 2, title: 'JavaScript: Core Logic', language: 'javascript', hint: 'Store the expression as a string and use try/catch around eval().',
          explanation: 'Implement the calculator logic. Store each button press in a string, then evaluate it on =.',
          code: `let expr = '';\nconst display = document.getElementById('display');\n\nfunction append(val) {\n  if (expr === '0' && !isNaN(val)) expr = val;\n  else expr += val;\n  display.textContent = expr;\n}\n\nfunction calculate() {\n  try {\n    const result = Function('"use strict"; return (' + expr + ')')();\n    display.textContent = result;\n    expr = String(result);\n  } catch (e) {\n    display.textContent = 'Error';\n    expr = '';\n  }\n}\n\nfunction clear() { expr = ''; display.textContent = '0'; }\nfunction del() { expr = expr.slice(0, -1); display.textContent = expr || '0'; }\n\n// Keyboard support\ndocument.addEventListener('keydown', e => {\n  if ('0123456789.+-*/%'.includes(e.key)) append(e.key);\n  if (e.key === 'Enter' || e.key === '=') calculate();\n  if (e.key === 'Backspace') del();\n  if (e.key === 'Escape') clear();\n});` }
      ]
    },
    {
      title: 'Create a Quiz Game',
      slug: 'quiz-game',
      description: 'Build an interactive multiple-choice quiz game with score tracking, timer, and animated results.',
      longDescription: 'Use arrays of objects, timers, and DOM updates to create a complete gamified quiz experience.',
      category: 'JavaScript', difficulty: 'Intermediate', group: 'beginner',
      emoji: '🧠', gradient: 'from-violet-500 to-purple-600',
      tags: ['Arrays', 'Objects', 'Timer', 'Animations'], xpReward: 180,
      estimatedTime: '60 min', featured: true,
      prerequisites: ['Arrays', 'Objects', 'Functions', 'DOM'],
      whatYoullLearn: ['Data-driven UIs', 'setInterval timer', 'Score tracking', 'Animated transitions'],
      theory: `## Data-Driven Quiz Architecture\nStore quiz questions as an array of objects, then render them one by one.\n\n### Key Concepts:\n- **Array of Objects** — each question is \`{ question, options, correct }\`\n- **setInterval** — countdown timer that ticks every second\n- **State management** — track currentIndex, score, answers`,
      steps: [
        { stepNum: 1, title: 'Define Question Data', language: 'javascript', hint: 'Create a const QUESTIONS array of objects, each with question, options[], and correct index.',
          explanation: 'All quiz data lives in a JavaScript array. This is the data-driven approach — your UI renders from data, not hardcoded HTML.',
          code: `const QUESTIONS = [\n  {\n    question: "What does 'const' do in JavaScript?",\n    options: ["Creates a variable", "Creates a constant", "Creates a function", "Creates a class"],\n    correct: 1\n  },\n  {\n    question: "Which method adds to the end of an array?",\n    options: [".shift()", ".unshift()", ".pop()", ".push()"],\n    correct: 3\n  },\n  {\n    question: "What does === check?",\n    options: ["Assignment", "Value only", "Value and type", "Reference"],\n    correct: 2\n  },\n  {\n    question: "What is a closure?",\n    options: ["A syntax error", "A function that remembers its outer scope", "A CSS property", "An HTML tag"],\n    correct: 1\n  },\n];` },
        { stepNum: 2, title: 'Render Questions & Handle Answers', language: 'javascript', hint: 'Use a currentIndex variable and call renderQuestion() each time the user answers.',
          explanation: 'Track the current question index. Render options as buttons, disable them after selection, highlight correct/wrong.',
          code: `let currentIndex = 0;\nlet score = 0;\nlet timeLeft = 15;\nlet timer;\n\nfunction renderQuestion() {\n  clearInterval(timer);\n  timeLeft = 15;\n  const q = QUESTIONS[currentIndex];\n  document.getElementById('question').textContent = q.question;\n  document.getElementById('progress').textContent =\n    \`\${currentIndex + 1} / \${QUESTIONS.length}\`;\n  const opts = document.getElementById('options');\n  opts.innerHTML = '';\n  q.options.forEach((opt, i) => {\n    const btn = document.createElement('button');\n    btn.className = 'option';\n    btn.textContent = opt;\n    btn.onclick = () => selectAnswer(i);\n    opts.appendChild(btn);\n  });\n  startTimer();\n}\n\nfunction selectAnswer(selected) {\n  clearInterval(timer);\n  const q = QUESTIONS[currentIndex];\n  const btns = document.querySelectorAll('.option');\n  btns.forEach(b => b.disabled = true);\n  btns[selected].classList.add(selected === q.correct ? 'correct' : 'wrong');\n  btns[q.correct].classList.add('correct');\n  if (selected === q.correct) score++;\n  setTimeout(nextQuestion, 1000);\n}\n\nfunction nextQuestion() {\n  currentIndex++;\n  if (currentIndex < QUESTIONS.length) renderQuestion();\n  else showResults();\n}\n\nfunction startTimer() {\n  const el = document.getElementById('timer');\n  timer = setInterval(() => {\n    el.textContent = --timeLeft;\n    if (timeLeft <= 0) { clearInterval(timer); selectAnswer(-1); }\n  }, 1000);\n}` },
        { stepNum: 3, title: 'Show Results Screen', language: 'javascript', hint: 'Show percentage score and a message based on how many they got right.',
          explanation: 'When all questions are done, hide the quiz and show a results card with score, percentage, and a replay button.',
          code: `function showResults() {\n  const pct = Math.round(score / QUESTIONS.length * 100);\n  const msg = pct >= 80 ? '🏆 Excellent!' : pct >= 60 ? '👍 Good job!' : '📚 Keep studying!';\n  document.getElementById('quiz').style.display = 'none';\n  document.getElementById('results').innerHTML = \`\n    <h2>\${msg}</h2>\n    <div class="score-circle">\${pct}%</div>\n    <p>You got \${score} out of \${QUESTIONS.length} correct</p>\n    <button onclick="location.reload()">Play Again 🔄</button>\n  \`;\n  document.getElementById('results').style.display = 'block';\n}` }
      ]
    },
    {
      title: 'Build a Weather App',
      slug: 'weather-app',
      description: 'Fetch real weather data from a public API and display it with beautiful animated icons.',
      longDescription: 'Learn async/await, fetch API, and JSON parsing by building a real-world weather dashboard.',
      category: 'JavaScript', difficulty: 'Intermediate', group: 'hackathon',
      emoji: '🌤️', gradient: 'from-sky-500 to-blue-600',
      tags: ['Fetch API', 'Async/Await', 'JSON', 'APIs'], xpReward: 200,
      estimatedTime: '50 min', featured: false,
      prerequisites: ['Async/Await', 'Fetch API', 'DOM', 'JSON'],
      whatYoullLearn: ['Fetching from APIs', 'async/await syntax', 'JSON parsing', 'Error handling'],
      theory: `## APIs & Async JavaScript\nAPIs (Application Programming Interfaces) let your app talk to external services. The Fetch API is the modern way to make HTTP requests.\n\n### Key Concepts:\n- **fetch()** — returns a Promise\n- **async/await** — write async code that reads like sync\n- **JSON.parse()** — convert API response to JS object\n- **try/catch** — handle network errors gracefully`,
      steps: [
        { stepNum: 1, title: 'Set up the UI', language: 'html', hint: 'A search input + button, a weather card section, and error display.',
          explanation: 'Create the layout: city search, current weather card showing temp/feels-like/humidity/wind.',
          code: `<div class="weather-app">\n  <div class="search">\n    <input id="cityInput" placeholder="Enter city name..." />\n    <button onclick="getWeather()">Search 🔍</button>\n  </div>\n  <div id="weatherCard" class="hidden">\n    <h2 id="cityName"></h2>\n    <div id="icon" class="weather-icon"></div>\n    <div id="temp" class="temp"></div>\n    <div id="desc"></div>\n    <div class="details">\n      <div>💧 <span id="humidity"></span></div>\n      <div>💨 <span id="wind"></span></div>\n    </div>\n  </div>\n  <div id="error" class="hidden error"></div>\n</div>` },
        { stepNum: 2, title: 'Fetch Weather Data', language: 'javascript', hint: 'Use: fetch(`https://wttr.in/${city}?format=j1`) — a free API requiring no key!',
          explanation: 'Use wttr.in, a free weather API that needs no API key. Fetch JSON and extract the fields you need.',
          code: `async function getWeather() {\n  const city = document.getElementById('cityInput').value.trim();\n  if (!city) return;\n  const card = document.getElementById('weatherCard');\n  const err = document.getElementById('error');\n  card.className = 'hidden'; err.className = 'hidden';\n  \n  try {\n    const res = await fetch(\`https://wttr.in/\${encodeURIComponent(city)}?format=j1\`);\n    if (!res.ok) throw new Error('City not found');\n    const data = await res.json();\n    \n    const current = data.current_condition[0];\n    const area = data.nearest_area[0];\n    \n    document.getElementById('cityName').textContent =\n      area.areaName[0].value + ', ' + area.country[0].value;\n    document.getElementById('temp').textContent =\n      current.temp_C + '°C / ' + current.temp_F + '°F';\n    document.getElementById('desc').textContent =\n      current.weatherDesc[0].value;\n    document.getElementById('humidity').textContent =\n      current.humidity + '% Humidity';\n    document.getElementById('wind').textContent =\n      current.windspeedKmph + ' km/h Wind';\n    \n    const icons = { Sunny: '☀️', Clear: '🌙', Cloudy: '☁️', Rain: '🌧️', Snow: '❄️', Thunder: '⛈️' };\n    const desc = current.weatherDesc[0].value;\n    document.getElementById('icon').textContent =\n      Object.entries(icons).find(([k]) => desc.includes(k))?.[1] ?? '🌤️';\n    \n    card.className = 'visible';\n  } catch (e) {\n    err.textContent = '❌ ' + e.message;\n    err.className = 'visible error';\n  }\n}` }
      ]
    },
    {
      title: 'Snake Game with JavaScript',
      slug: 'snake-game',
      description: 'Build the classic Snake game using HTML Canvas, requestAnimationFrame, and keyboard controls.',
      longDescription: 'Master HTML Canvas 2D drawing, game loops, collision detection, and keyboard input management.',
      category: 'JavaScript', difficulty: 'Intermediate', group: 'all',
      emoji: '🐍', gradient: 'from-green-500 to-emerald-600',
      tags: ['Canvas', 'Game Loop', 'Keyboard', 'Collision'], xpReward: 250,
      estimatedTime: '90 min', featured: true,
      prerequisites: ['Functions', 'Arrays', 'setInterval'],
      whatYoullLearn: ['HTML Canvas 2D API', 'Game loop with requestAnimationFrame', 'Collision detection', 'Keyboard input'],
      theory: `## Game Development with Canvas\nThe &lt;canvas&gt; element is a drawing surface. JavaScript can draw shapes, images, and text on it every frame to create animations and games.\n\n### Key Concepts:\n- **Canvas 2D Context** — \`ctx.fillRect(x, y, w, h)\`\n- **Game Loop** — update state + redraw every ~100ms\n- **Collision Detection** — check if head overlaps wall or body\n- **Direction Queue** — prevent reversing direction instantly`,
      steps: [
        { stepNum: 1, title: 'Canvas Setup & Game Variables', language: 'javascript', hint: 'Set canvas size to 400x400. Each cell is 20px so the grid is 20x20.',
          explanation: 'Initialize the canvas and all game state: snake array, food position, direction, and score.',
          code: `const canvas = document.getElementById('gameCanvas');\nconst ctx = canvas.getContext('2d');\nconst GRID = 20, CELL = canvas.width / GRID;\n\nlet snake = [{x:10, y:10}];\nlet food = randomFood();\nlet dir = {x:1, y:0};\nlet nextDir = {x:1, y:0};\nlet score = 0;\nlet gameLoop;\n\nfunction randomFood() {\n  return { x: Math.floor(Math.random()*GRID), y: Math.floor(Math.random()*GRID) };\n}\n\ndocument.addEventListener('keydown', e => {\n  const k = e.key;\n  if (k==='ArrowUp'    && dir.y===0) nextDir={x:0,y:-1};\n  if (k==='ArrowDown'  && dir.y===0) nextDir={x:0,y:1};\n  if (k==='ArrowLeft'  && dir.x===0) nextDir={x:-1,y:0};\n  if (k==='ArrowRight' && dir.x===0) nextDir={x:1,y:0};\n});` },
        { stepNum: 2, title: 'Game Loop: Update & Draw', language: 'javascript', hint: 'Draw grid background first, then food (red), then each snake segment (green).',
          explanation: 'The core game loop: move snake, check collisions, eat food, then draw everything fresh each frame.',
          code: `function update() {\n  dir = nextDir;\n  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };\n  \n  // Wall collision\n  if (head.x<0||head.x>=GRID||head.y<0||head.y>=GRID) return gameOver();\n  // Self collision\n  if (snake.some(s => s.x===head.x && s.y===head.y)) return gameOver();\n  \n  snake.unshift(head);\n  \n  if (head.x===food.x && head.y===food.y) {\n    score++;\n    document.getElementById('score').textContent = score;\n    food = randomFood();\n  } else {\n    snake.pop();\n  }\n}\n\nfunction draw() {\n  ctx.fillStyle = '#0f172a';\n  ctx.fillRect(0,0,canvas.width,canvas.height);\n  \n  // Draw food\n  ctx.fillStyle = '#ef4444';\n  ctx.fillRect(food.x*CELL+2, food.y*CELL+2, CELL-4, CELL-4);\n  \n  // Draw snake\n  snake.forEach((s,i) => {\n    ctx.fillStyle = i===0 ? '#22d3ee' : '#10b981';\n    ctx.fillRect(s.x*CELL+1, s.y*CELL+1, CELL-2, CELL-2);\n  });\n}\n\nfunction tick() { update(); draw(); }\nfunction startGame() { gameLoop = setInterval(tick, 120); }\nfunction gameOver() {\n  clearInterval(gameLoop);\n  ctx.fillStyle='rgba(0,0,0,0.7)';\n  ctx.fillRect(0,0,canvas.width,canvas.height);\n  ctx.fillStyle='white'; ctx.font='bold 28px Inter'; ctx.textAlign='center';\n  ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);\n  ctx.font='16px Inter';\n  ctx.fillText('Score: '+score, canvas.width/2, canvas.height/2+35);\n}` }
      ]
    },
    {
      title: 'Personal Portfolio Website',
      slug: 'portfolio-website',
      description: 'Build a stunning personal portfolio with animations, dark mode, and smooth scrolling sections.',
      longDescription: 'Learn CSS animations, responsive design, and JavaScript scroll effects to build a job-ready portfolio.',
      category: 'HTML', difficulty: 'Beginner', group: 'hackathon',
      emoji: '🎨', gradient: 'from-pink-500 to-rose-600',
      tags: ['CSS Animations', 'Responsive', 'Scroll Effects'], xpReward: 160,
      estimatedTime: '75 min', featured: true,
      prerequisites: ['HTML Structure', 'CSS Styling', 'Flexbox'],
      whatYoullLearn: ['CSS animations', 'Responsive design', 'CSS variables', 'Intersection Observer'],
      theory: `## Modern Portfolio Design\nA great portfolio showcases your identity, projects, and skills. Modern portfolios use CSS custom properties, smooth animations, and proper responsive layouts.\n\n### Key Concepts:\n- **CSS Variables** — \`--primary: #6366f1\`\n- **Intersection Observer** — trigger animations on scroll\n- **CSS Grid + Flexbox** — layout your sections beautifully`,
      steps: [
        { stepNum: 1, title: 'HTML: Semantic Structure', language: 'html', hint: 'Use <header>, <main>, <section id="about">, <section id="projects">, <footer> for proper semantics.',
          explanation: 'Great portfolio HTML is semantic — use correct HTML5 elements so screen readers and SEO benefit.',
          code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Your Name | Developer</title>\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet">\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <nav class="navbar">\n    <span class="logo">✨ YourName</span>\n    <div class="nav-links">\n      <a href="#about">About</a>\n      <a href="#projects">Projects</a>\n      <a href="#skills">Skills</a>\n      <a href="#contact">Contact</a>\n    </div>\n  </nav>\n  <header class="hero">\n    <h1>Hi, I'm <span class="accent">Your Name</span> 👋</h1>\n    <p>I build cool things with code.</p>\n    <a href="#projects" class="btn">View My Work</a>\n  </header>\n  <!-- more sections -->\n  <script src="app.js"></script>\n</body>\n</html>` },
        { stepNum: 2, title: 'CSS: Dark Theme & Animations', language: 'css', hint: 'Define CSS variables in :root and use them throughout. Add @keyframes for the hero animation.',
          explanation: 'Use CSS custom properties for consistent theming and keyframes for the hero section entrance animation.',
          code: `:root {\n  --bg: #0a0a0f;\n  --card: #1a1a2e;\n  --primary: #6366f1;\n  --accent: #f59e0b;\n  --text: #e2e8f0;\n  --muted: #64748b;\n}\n* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); }\n.navbar { position: fixed; top: 0; width: 100%; padding: 16px 40px; display: flex; justify-content: space-between; background: rgba(10,10,15,0.9); backdrop-filter: blur(10px); z-index: 100; }\n.hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 100px 20px 60px; animation: fadeUp 0.8s ease-out; }\n@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }\nh1 { font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 900; line-height: 1.1; margin-bottom: 16px; }\n.accent { color: var(--primary); }\n.btn { display: inline-block; margin-top: 24px; padding: 14px 32px; background: var(--primary); color: white; border-radius: 12px; text-decoration: none; font-weight: 700; transition: transform 0.2s, box-shadow 0.2s; }\n.btn:hover { transform: scale(1.05); box-shadow: 0 10px 30px rgba(99,102,241,0.4); }` }
      ]
    },
    {
      title: 'Generate AI Blog Posts with OpenAI',
      slug: 'ai-blog-generator',
      description: 'Use the OpenAI API to build a blog post generator that creates content from a topic prompt.',
      longDescription: 'Learn how to use the OpenAI Chat Completions API with Node.js and Express to build a real AI-powered tool.',
      category: 'AI', difficulty: 'Intermediate', group: 'ai',
      emoji: '🤖', gradient: 'from-emerald-500 to-purple-600',
      tags: ['OpenAI', 'Node.js', 'API', 'Async'], xpReward: 250,
      estimatedTime: '60 min', featured: true,
      prerequisites: ['Node.js', 'Express', 'Fetch API', 'Async/Await'],
      whatYoullLearn: ['OpenAI Chat API', 'Prompt engineering', 'Streaming responses', 'Node.js backend'],
      theory: `## OpenAI Chat Completions API\nOpenAI provides a REST API that lets you send a conversation (messages array) and receive an AI-generated response.\n\n### Key Concepts:\n- **Messages array** — \`[{role: "user", content: "your prompt"}]\`\n- **Model** — \`gpt-3.5-turbo\` or \`gpt-4\`\n- **Prompt Engineering** — how you phrase the prompt drastically changes the output\n- **Temperature** — 0=deterministic, 1=creative`,
      steps: [
        { stepNum: 1, title: 'Setup Node.js Backend', language: 'javascript', hint: 'Install openai package: npm install express cors openai dotenv',
          explanation: 'Create an Express server that takes a topic from the frontend and calls the OpenAI API.',
          code: `const express = require('express');\nconst cors = require('cors');\nconst OpenAI = require('openai');\nrequire('dotenv').config();\n\nconst app = express();\napp.use(cors());\napp.use(express.json());\n\nconst openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });\n\napp.post('/generate', async (req, res) => {\n  const { topic } = req.body;\n  if (!topic) return res.status(400).json({ error: 'Topic required' });\n  \n  const completion = await openai.chat.completions.create({\n    model: 'gpt-3.5-turbo',\n    messages: [\n      { role: 'system', content: 'You are a professional blog writer. Write engaging, informative content.' },\n      { role: 'user', content: \`Write a 300-word blog post about: \${topic}\` }\n    ],\n    temperature: 0.7,\n    max_tokens: 500,\n  });\n  \n  res.json({ content: completion.choices[0].message.content });\n});\n\napp.listen(3001, () => console.log('AI server on port 3001'));` },
        { stepNum: 2, title: 'Frontend: Generate UI', language: 'javascript', hint: 'Fetch POST to /generate with { topic } in JSON body, then display the result.',
          explanation: 'Build the frontend with a topic input, generate button, and output area.',
          code: `async function generateBlog() {\n  const topic = document.getElementById('topic').value.trim();\n  if (!topic) return;\n  \n  const btn = document.getElementById('genBtn');\n  const output = document.getElementById('output');\n  btn.textContent = 'Generating...';\n  btn.disabled = true;\n  output.textContent = '';\n  \n  try {\n    const res = await fetch('http://localhost:3001/generate', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ topic })\n    });\n    const data = await res.json();\n    output.textContent = data.content;\n  } catch (e) {\n    output.textContent = 'Error: ' + e.message;\n  } finally {\n    btn.textContent = 'Generate ✨';\n    btn.disabled = false;\n  }\n}` }
      ]
    },
    {
      title: 'Build a React Counter App',
      slug: 'react-counter',
      description: 'Your first React app — a counter with increment, decrement, reset, and step controls using useState.',
      longDescription: 'Learn React fundamentals: components, props, state with useState hook, and event handling.',
      category: 'React', difficulty: 'Beginner', group: 'beginner',
      emoji: '⚛️', gradient: 'from-cyan-500 to-blue-600',
      tags: ['React', 'useState', 'Components', 'Hooks'], xpReward: 130,
      estimatedTime: '30 min', featured: false,
      prerequisites: ['JavaScript Functions', 'HTML/CSS'],
      whatYoullLearn: ['React components', 'useState hook', 'Event handlers', 'Conditional rendering'],
      theory: `## React: The Component Way\nReact breaks UIs into reusable components. Each component has its own **state** (data that can change) and **props** (data passed from parent).\n\n### Key Concepts:\n- **useState** — \`const [count, setCount] = useState(0)\`\n- **Re-render** — React re-renders the component whenever state changes\n- **JSX** — HTML-like syntax in JavaScript`,
      steps: [
        { stepNum: 1, title: 'Create Vite React App', language: 'bash', hint: 'npm create vite@latest my-counter -- --template react',
          explanation: 'Use Vite to scaffold a React app quickly. It sets up everything including hot module replacement.',
          code: `npm create vite@latest my-counter -- --template react\ncd my-counter\nnpm install\nnpm run dev` },
        { stepNum: 2, title: 'Build the Counter Component', language: 'javascript', hint: 'usestate to track both count and step. Prevent going below 0 with Math.max.',
          explanation: 'Create a Counter component with useState for the count and step size. Add buttons and style with CSS.',
          code: `import { useState } from 'react';\nimport './Counter.css';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  const [step, setStep] = useState(1);\n  \n  const pct = Math.min(Math.max(count / 100, 0), 1) * 100;\n  \n  return (\n    <div className="counter-card">\n      <h1>Counter App</h1>\n      <div className="count-display" style={{ color: count > 50 ? '#22d3ee' : count < 0 ? '#ef4444' : '#a5b4fc' }}>\n        {count}\n      </div>\n      <div className="progress-bar">\n        <div style={{ width: \`\${pct}%\`, background: '#6366f1', height: '100%', borderRadius: 4, transition: '0.3s' }} />\n      </div>\n      <div className="buttons">\n        <button onClick={() => setCount(c => c - step)}>−{step}</button>\n        <button onClick={() => setCount(0)}>Reset</button>\n        <button onClick={() => setCount(c => c + step)}>+{step}</button>\n      </div>\n      <div className="step-control">\n        <label>Step: </label>\n        <input type="range" min="1" max="10" value={step}\n          onChange={e => setStep(Number(e.target.value))} />\n        <span>{step}</span>\n      </div>\n    </div>\n  );\n}` }
      ]
    },
    {
      title: 'Launch a Website with Vercel',
      slug: 'deploy-vercel',
      description: 'Learn to deploy your project to the internet for free using Vercel in under 5 minutes.',
      longDescription: 'Step-by-step guide to push your project to GitHub and deploy to Vercel for a live public URL.',
      category: 'JavaScript', difficulty: 'Beginner', group: 'hackathon',
      emoji: '🚀', gradient: 'from-slate-600 to-slate-800',
      tags: ['Deployment', 'Git', 'GitHub', 'Vercel'], xpReward: 100,
      estimatedTime: '20 min', featured: false,
      prerequisites: ['Basic HTML/CSS/JS project'],
      whatYoullLearn: ['Git basics', 'GitHub repository', 'Vercel deployment', 'Custom domains'],
      theory: `## Deployment 101\nDeployment means making your app accessible to anyone on the internet. Vercel is a free hosting platform that integrates directly with GitHub.\n\n### Key Concepts:\n- **Git** — version control system\n- **GitHub** — code hosting platform\n- **Vercel** — serverless deployment platform\n- **CI/CD** — auto-deploy when you push to GitHub`,
      steps: [
        { stepNum: 1, title: 'Initialize Git & Push to GitHub', language: 'bash', hint: 'Create a new repo on github.com first, then follow the git commands.',
          explanation: 'Initialize git in your project, add all files, commit, and push to a GitHub repository.',
          code: `git init\ngit add .\ngit commit -m "Initial commit"\ngit branch -M main\ngit remote add origin https://github.com/yourusername/your-repo.git\ngit push -u origin main` },
        { stepNum: 2, title: 'Deploy on Vercel', language: 'bash', hint: 'Install Vercel CLI globally with npm install -g vercel',
          explanation: 'Use Vercel CLI or the Vercel dashboard to deploy your project with one command.',
          code: `npm install -g vercel\nvercel login\nvercel\n# Follow prompts — select project type, etc.\n# Your site is now live at: https://your-project.vercel.app` }
      ]
    },
    {
      title: 'Image Gallery with CSS Grid',
      slug: 'image-gallery',
      description: 'Build a responsive masonry-style image gallery with lightbox and hover animations.',
      longDescription: 'Master CSS Grid, object-fit, and dialog/modal patterns to create a professional image gallery.',
      category: 'HTML', difficulty: 'Beginner', group: 'all',
      emoji: '🖼️', gradient: 'from-orange-500 to-pink-600',
      tags: ['CSS Grid', 'Animations', 'Responsive', 'Lightbox'], xpReward: 140,
      estimatedTime: '45 min', featured: false,
      prerequisites: ['HTML', 'CSS Flexbox/Grid basics'],
      whatYoullLearn: ['CSS Grid masonry', 'object-fit', 'CSS hover transitions', 'Modal/lightbox pattern'],
      theory: `## CSS Grid Masonry\nCSS Grid is a 2D layout system. For a gallery, use \`auto-fill\` with \`minmax()\` so cards automatically wrap.\n\n### Key Pattern:\n\`\`\`css\n.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }\n\`\`\`\n\n- **object-fit: cover** — fills the box without stretching\n- **aspect-ratio** — maintain consistent card proportions\n- **dialog** element — native HTML modal`,
      steps: [
        { stepNum: 1, title: 'HTML Grid Structure', language: 'html', hint: 'Give each image card a class="card" and include img + caption overlay.',
          explanation: 'Build a gallery grid with image cards that have overlay captions.',
          code: `<div class="gallery">\n  <div class="card" onclick="openLight(this)">\n    <img src="https://picsum.photos/seed/1/600/400" alt="Nature">\n    <div class="caption">🌿 Nature</div>\n  </div>\n  <div class="card" onclick="openLight(this)">\n    <img src="https://picsum.photos/seed/2/600/400" alt="City">\n    <div class="caption">🌆 City</div>\n  </div>\n  <!-- more cards -->\n</div>\n<dialog id="lightbox">\n  <img id="lightboxImg">\n  <button onclick="document.getElementById('lightbox').close()">✕</button>\n</dialog>` },
        { stepNum: 2, title: 'Gallery CSS + Lightbox JS', language: 'css', hint: 'Use position:relative on .card and position:absolute on .caption to overlay it.',
          explanation: 'Style the grid with auto-fill columns, overlay captions on hover, and the lightbox dialog.',
          code: `.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; padding: 20px; }\n.card { position: relative; border-radius: 12px; overflow: hidden; cursor: pointer; aspect-ratio: 4/3; }\n.card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }\n.card:hover img { transform: scale(1.08); }\n.caption { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px 12px 12px; background: linear-gradient(transparent, rgba(0,0,0,0.7)); color: white; font-weight: 600; transform: translateY(100%); transition: transform 0.3s ease; }\n.card:hover .caption { transform: translateY(0); }\ndialog { border: none; border-radius: 16px; background: #0f172a; padding: 0; max-width: 90vw; }\ndialog img { max-width: 80vw; max-height: 80vh; display: block; border-radius: 12px; }` }
      ]
    },
    {
      title: 'Build a Chatbot with Node.js',
      slug: 'chatbot-nodejs',
      description: 'Create a real-time chatbot backend with Node.js and Socket.io, plus a clean frontend UI.',
      longDescription: 'Learn WebSockets, Socket.io, and real-time communication patterns by building a working chatbot.',
      category: 'Node.js', difficulty: 'Intermediate', group: 'ai',
      emoji: '💬', gradient: 'from-purple-500 to-indigo-600',
      tags: ['Socket.io', 'Node.js', 'Real-time', 'WebSocket'], xpReward: 220,
      estimatedTime: '75 min', featured: false,
      prerequisites: ['Node.js', 'Express', 'JavaScript'],
      whatYoullLearn: ['WebSocket protocol', 'Socket.io events', 'Real-time messaging', 'Chat UX patterns'],
      theory: `## WebSockets & Socket.io\nUnlike HTTP (one request → one response), WebSockets keep a persistent connection open so the server can push data to the client at any time.\n\n### Key Concepts:\n- **HTTP** — request/response, connection closes\n- **WebSocket** — persistent bidirectional connection\n- **Socket.io** — library that wraps WebSockets with fallbacks\n- **Rooms** — group sockets so messages go to specific users`,
      steps: [
        { stepNum: 1, title: 'Setup Socket.io Server', language: 'javascript', hint: 'npm install express socket.io — then wrap express app with http.createServer()',
          explanation: 'Create the Socket.io server. Note: you must use http.createServer(app) not just app.listen().',
          code: `const express = require('express');\nconst http = require('http');\nconst { Server } = require('socket.io');\n\nconst app = express();\nconst server = http.createServer(app);\nconst io = new Server(server);\n\napp.use(express.static('public'));\n\nconst BOT_RESPONSES = {\n  hello: "Hi there! 👋 How can I help you?",\n  help: "I can answer questions about JavaScript, Python, and more!",\n  bye: "Goodbye! Happy coding! 🚀",\n};\n\nio.on('connection', socket => {\n  socket.on('user:message', (text) => {\n    io.emit('bot:message', { from: 'You', text, time: new Date().toLocaleTimeString() });\n    const key = Object.keys(BOT_RESPONSES).find(k => text.toLowerCase().includes(k));\n    const reply = key ? BOT_RESPONSES[key] : "Interesting! I'm still learning. 🤔";\n    setTimeout(() => {\n      io.emit('bot:message', { from: '🤖 Bot', text: reply, time: new Date().toLocaleTimeString() });\n    }, 600);\n  });\n});\n\nserver.listen(3000, () => console.log('💬 Chat server on port 3000'));` }
      ]
    },
    {
      title: 'Data Visualization Dashboard',
      slug: 'data-dashboard',
      description: 'Build an interactive dashboard with animated charts using Chart.js and real data.',
      longDescription: 'Create bar charts, line graphs, and pie charts from JSON data. Learn data visualization principles.',
      category: 'JavaScript', difficulty: 'Intermediate', group: 'all',
      emoji: '📊', gradient: 'from-yellow-500 to-orange-600',
      tags: ['Chart.js', 'Data', 'Canvas', 'JSON'], xpReward: 200,
      estimatedTime: '60 min', featured: false,
      prerequisites: ['JavaScript', 'Arrays & Objects', 'DOM'],
      whatYoullLearn: ['Chart.js library', 'Data transformation', 'Responsive charts', 'Color schemes'],
      theory: `## Data Visualization\nCharts make data understandable at a glance. Chart.js is a popular library that renders beautiful animated charts on HTML Canvas.\n\n### Chart Types:\n- **Bar Chart** — compare categories\n- **Line Chart** — show trends over time\n- **Pie/Doughnut** — show proportions\n- **Radar** — compare multiple metrics`,
      steps: [
        { stepNum: 1, title: 'Include Chart.js & Create Canvas', language: 'html', hint: 'Use CDN: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>',
          explanation: 'Set up the HTML with canvas elements for each chart. Chart.js needs a canvas to draw on.',
          code: `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n\n<div class="dashboard">\n  <div class="chart-card">\n    <h3>📈 Monthly Learning XP</h3>\n    <canvas id="lineChart"></canvas>\n  </div>\n  <div class="chart-card">\n    <h3>🥧 Language Breakdown</h3>\n    <canvas id="pieChart"></canvas>\n  </div>\n  <div class="chart-card">\n    <h3>📊 Challenges Completed</h3>\n    <canvas id="barChart"></canvas>\n  </div>\n</div>` },
        { stepNum: 2, title: 'Create Charts with Chart.js', language: 'javascript', hint: "new Chart(ctx, { type: 'line', data: {...}, options: {...} })",
          explanation: 'Initialize each chart with data and options. Chart.js handles animation automatically.',
          code: `const months = ['Jan','Feb','Mar','Apr','May','Jun'];\nconst xpData = [120, 350, 280, 600, 450, 800];\n\nnew Chart(document.getElementById('lineChart'), {\n  type: 'line',\n  data: {\n    labels: months,\n    datasets: [{ label: 'XP Earned', data: xpData,\n      borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)',\n      tension: 0.4, fill: true }]\n  },\n  options: { responsive: true, plugins: { legend: { labels: { color: '#e2e8f0' } } },\n    scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' } } } }\n});\n\nnew Chart(document.getElementById('pieChart'), {\n  type: 'doughnut',\n  data: {\n    labels: ['JavaScript', 'Python', 'HTML', 'React'],\n    datasets: [{ data: [45, 25, 20, 10],\n      backgroundColor: ['#fbbf24','#3b82f6','#f97316','#06b6d4'] }]\n  },\n  options: { responsive: true }\n});` }
      ]
    }
  ];

  await Project.insertMany(projects);
  console.log(`✅ Seeded ${projects.length} projects!`);
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
