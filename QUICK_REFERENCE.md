# ⚡ CodeQuest Python Course - Quick Reference Guide

## 🚀 Quick Start Commands

### Seed Database (Initialize All Courses)
```bash
cd server
npm run seed
# Wait for "🎉 Seed complete!" message
```

### Start Development Server
```bash
# Terminal 1 - Backend
cd server
npm start
# Expected: Server running on port 5000

# Terminal 2 - Frontend  
cd client
npm run dev
# Expected: Vite dev server on port 5173
```

### Run Production Build
```bash
cd client
npm run build
# Creates dist/ folder with optimized build
```

### Access Application
```
http://localhost:5173  (Development)
http://localhost:5000  (Backend API)
```

---

## 📊 Database Quick Queries

### Check Python Challenges
```javascript
// MongoDB CLI or Compass
db.challenges.find({ language: 'python' }).count()
// Should return: 15
```

### View Python Course
```javascript
db.courses.findOne({ language: 'python' })
// Shows all 5 levels
```

### Check User Progress
```javascript
db.progresses.find({ userId: ObjectId("...") })
// Shows all completed challenges
```

### View Level 5 Challenges
```javascript
db.challenges.find({ levelNum: 5, language: 'python' })
// Should return 3 challenges
```

### Clear Python Data (DESTRUCTIVE!)
```javascript
db.challenges.deleteMany({ language: 'python' })
db.courses.deleteMany({ language: 'python' })
db.progresses.deleteMany({ course: 'Python Basics' })
```

---

## 🐍 Testing Python Execution

### Manual Python Code Test
1. Open browser DevTools (F12)
2. Go to Application → Python course
3. Open any theory section
4. Click "Run" on code example
5. Check console for output

### Test Pyodide Loading
```javascript
// In browser console
console.log(window.pyodide)
// Should show Pyodide object if loaded
```

### Debug Python Error
```python
# Add debug prints
print("DEBUG: Starting calculation")
result = function_call()
print(f"DEBUG: Result = {result}")
```

---

## 🔧 Common Development Tasks

### Add New Challenge
1. Open `server/scripts/seed.js`
2. Find `pythonChallenges` array
3. Add new object to array:
```javascript
{
  levelNum: 5,
  order: 0,
  title: 'My Challenge',
  functionName: 'my_function',
  difficulty: 'medium',
  xpReward: 30,
  language: 'python',
  description: 'Challenge description',
  starterCode: 'def my_function(param):\n    pass',
  testCases: [
    { args: [10], expected: 20, description: 'Double the input' }
  ],
  hints: ['First hint', 'Second hint'],
  storyContext: 'Story...',
  tags: ['functions']
}
```
4. Reseed: `npm run seed`
5. Refresh browser

### Add New Level
1. Open `seed.js`
2. Add to `pythonCourse.levels`:
```javascript
{
  levelNum: 6,
  title: 'Advanced OOP',
  icon: '🎓',
  theory: {
    title: 'Classes and Objects',
    topics: [...]
  }
}
```
3. Add 3 new challenges with `levelNum: 6`
4. Reseed database

### Fix Python Error Message
1. Open `TheoryPage.jsx` and `ChallengePage.jsx`
2. Find `runPython()` function
3. Modify error extraction logic:
```javascript
if (errorMsg.includes('PythonError:')) {
  errorMsg = errorMsg.replace('PythonError: ', '');
  errorMsg = errorMsg.split('File')[0].trim(); // Remove file refs
}
```

### Monitor Performance
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/challenges

# Monitor MongoDB performance
# Use MongoDB Compass → Performance tab
# or MongoDB Atlas → Monitoring
```

---

## 🐛 Troubleshooting Quick Fix

### Issue: "No challenges yet"
```bash
# Solution:
cd server && npm run seed
# Then refresh browser
```

### Issue: Python doesn't execute
```bash
# Solution 1: Check Pyodide loaded
# DevTools → Console → type: window.pyodide

# Solution 2: Check CDN
# Open https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js
# in browser - should load without error

# Solution 3: Try different browser
```

### Issue: XP not awarded
```bash
# Debug steps:
# 1. Check backend console for errors
# 2. Check MongoDB Progress record created
# 3. Try submitting again
# 4. Check user.xp field updated

# Query:
db.users.findOne({ _id: ObjectId("...") }).xp
```

### Issue: Level won't unlock
```bash
# Check progress:
db.progresses.find({ userId, courseId, levelNum: 4 })
// Should show 3 records, all with completed: true

# Manually unlock (if needed):
db.users.updateOne(
  { _id: ObjectId("...") },
  { $set: { level: 5 } }
)
```

### Issue: Badge not awarded
```bash
# Check user badges:
db.users.findOne({ _id: ObjectId("...") }).badges

# Recheck badge conditions in controller
// Then resubmit a challenge
```

---

## 📈 Monitoring Checklist

### Daily Health Check
```bash
# 1. Server running?
curl http://localhost:5000/api/health

# 2. Database connected?
# Check MongoDB Atlas dashboard

# 3. Pyodide loading?
# Check CDN availability

# 4. Any errors in logs?
# Review server terminal output
```

### Weekly Performance Review
```bash
# Check response times:
- API latency: <100ms?
- Database queries: <50ms?
- Frontend load: <2s?
- Python execution: <200ms?

# If slow:
# 1. Check database indexes
# 2. Profile slow queries
# 3. Monitor server resources
# 4. Check CDN latency
```

### Monthly Data Backup
```bash
# Backup MongoDB
mongodump --uri="<connection_string>" -o ./backup_$(date +%Y%m%d)

# Verify backup
ls -la backup_*
```

---

## 🔐 Security Checklist

### Before Production
- [ ] Update Pyodide to latest version
- [ ] Enable HTTPS only
- [ ] Set secure JWT secret
- [ ] Configure CORS properly
- [ ] Enable MongoDB authentication
- [ ] Add rate limiting
- [ ] Setup logging/monitoring
- [ ] Test with OWASP ZAP
- [ ] Review environment variables
- [ ] Backup database

### Ongoing Security
- [ ] Monitor error logs for attacks
- [ ] Review access logs weekly
- [ ] Update dependencies monthly
- [ ] Audit user permissions quarterly
- [ ] Penetration test annually

---

## 📚 File Location Reference

### Backend Files
```
server/
├── index.js                    # Express server entry
├── routes/
│   ├── challenges.js          # Challenge endpoints
│   └── auth.js               # Authentication
├── controllers/
│   ├── challengeController.js # Challenge logic ← MODIFIED
│   └── authController.js      # Auth logic
├── models/
│   ├── Challenge.js           # Challenge schema
│   ├── User.js               # User schema
│   └── Progress.js           # Progress schema
└── scripts/
    └── seed.js                # Database seeding ← MODIFIED
```

### Frontend Files
```
client/src/
├── pages/
│   ├── TheoryPage.jsx         # Theory display ← MODIFIED
│   ├── ChallengePage.jsx      # Challenge UI ← MODIFIED
│   └── DashboardPage.jsx      # Course list
├── components/
│   ├── CodeEditor.jsx         # Monaco editor
│   └── OutputConsole.jsx      # Output display
└── api/
    └── axios.js               # API client
```

---

## 🎯 Key Metrics Dashboard

### XP System
```
Level 1: 95 XP (45 + 50 bonus)
Level 2: 110 XP (60 + 50 bonus)
Level 3: 125 XP (75 + 50 bonus)
Level 4: 140 XP (90 + 50 bonus)
Level 5: 155 XP (105 + 50 bonus) ← NEW

Total: 625 XP maximum
```

### Challenge Count
```
Level 1: 3 challenges (15, 15, 15 XP)
Level 2: 3 challenges (20, 20, 20 XP)
Level 3: 3 challenges (25, 25, 25 XP)
Level 4: 3 challenges (30, 30, 30 XP)
Level 5: 3 challenges (30, 35, 40 XP) ← NEW

Total: 15 challenges
```

### Courses
```
Python: 15 challenges ← NEW
JavaScript: 15 challenges
HTML/CSS: 12 challenges
React: 12 challenges
TypeScript: 12 challenges
Node.js: 12 challenges

Total: 78 challenges
```

---

## 🚨 Emergency Procedures

### If Database is Down
```bash
# Check connection
mongo --uri "your_connection_string"

# If failed, check:
# 1. MongoDB Atlas status page
# 2. Network connectivity
# 3. Whitelist IP addresses
# 4. Try different connection method

# Restore from backup if needed
mongorestore ./backup_latest --uri "connection_string"
```

### If Server Crashes
```bash
# Kill existing process
pkill -f "node server"

# Check for errors
tail -100 server.log

# Restart
cd server && npm start
```

### If Frontend Won't Load
```bash
# Clear cache
# Ctrl+Shift+Delete → Clear browsing data

# Check build
cd client && npm run build

# Check for 404s
# DevTools Network tab

# Rebuild if needed
rm -rf dist/ && npm run build
```

### If Pyodide Won't Load
```bash
# Check CDN
curl -I https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js

# Add fallback CDN in code:
<!-- Primary -->
<script src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js"></script>
<!-- Fallback (if primary fails) -->
<script>
  if (!window.loadPyodide) {
    // Load from alternative CDN
  }
</script>
```

---

## 📞 Support Quick Links

- **Python Docs:** https://docs.python.org/3/
- **Pyodide Docs:** https://pyodide.org/
- **MongoDB Docs:** https://docs.mongodb.com/
- **React Docs:** https://react.dev/
- **Express Docs:** https://expressjs.com/
- **Vite Docs:** https://vitejs.dev/

---

## ✅ Pre-Launch Checklist

- [ ] All code changes committed
- [ ] Database seeded successfully
- [ ] No console errors
- [ ] All 15 Python challenges load
- [ ] Python code execution works
- [ ] XP system awards points
- [ ] Badges display correctly
- [ ] Levels unlock properly
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] All documentation updated
- [ ] Team trained on system
- [ ] Monitoring configured

---

## 🎓 Learning Path for New Devs

1. **Week 1:** Read TECHNICAL_GUIDE.md
2. **Week 2:** Read seed.js and understand data structure
3. **Week 3:** Read challengeController.js and understand logic
4. **Week 4:** Make small modifications (add a hint, change XP)
5. **Week 5:** Add a new challenge end-to-end
6. **Week 6:** Ready to handle production issues

---

**Last Updated:** Today  
**Status:** ✅ Ready for Use  
**Questions?** Check the relevant guide document or contact the development team.

🚀 **Happy Coding!**
