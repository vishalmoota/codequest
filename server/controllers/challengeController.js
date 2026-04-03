const Challenge = require('../models/Challenge');
const Progress = require('../models/Progress');
const User = require('../models/User');
const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');

// Safely run user code against test cases in Node.js sandbox
const runUserCode = (userCode, functionName, testCases, isHTML = false) => {
  const results = [];
  
  // For HTML challenges: treat code as HTML/CSS and validate by function call (starterCode is still JS function)
  if (isHTML && functionName) {
    for (const tc of testCases) {
      try {
        // HTML challenges still use JS functions that generate HTML strings
        const wrapped = new Function(
          `${userCode}\n return ${functionName}(...arguments);`
        );
        const args = Array.isArray(tc.args) ? tc.args : [tc.args];
        const actual = wrapped(...args);
        const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
        results.push({ passed, actual, expected: tc.expected, description: tc.description || '' });
      } catch (err) {
        results.push({ passed: false, error: err.message, expected: tc.expected, description: tc.description || '' });
      }
    }
    return results;
  }
  
  // For JavaScript challenges
  for (const tc of testCases) {
    try {
      // Build a sandboxed function from user code
      const wrapped = new Function(
        `${userCode}\n return ${functionName}(...arguments);`
      );
      const args = Array.isArray(tc.args) ? tc.args : [tc.args];
      const actual = wrapped(...args);
      const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
      results.push({ passed, actual, expected: tc.expected, description: tc.description || '' });
    } catch (err) {
      results.push({ passed: false, error: err.message, expected: tc.expected, description: tc.description || '' });
    }
  }
  return results;
};

// Badge award logic
const BADGES = [
  { id: 'first_blood',    label: '🩸 First Blood',      condition: (xp, completedCount) => completedCount === 1 },
  { id: 'level_2_unlock', label: '🔓 Level 2 Unlocked',  condition: (xp, c, unlockedLevel) => unlockedLevel >= 2 },
  { id: 'level_3_unlock', label: '🔓 Level 3 Unlocked',  condition: (xp, c, unlockedLevel) => unlockedLevel >= 3 },
  { id: 'level_4_unlock', label: '🔓 Level 4 Unlocked',  condition: (xp, c, unlockedLevel) => unlockedLevel >= 4 },
  { id: 'level_5_unlock', label: '🔓 Level 5 Unlocked',  condition: (xp, c, unlockedLevel) => unlockedLevel >= 5 },
  { id: 'xp_100',         label: '⚡ 100 XP Club',       condition: (xp) => xp >= 100 },
  { id: 'xp_500',         label: '🚀 500 XP Legend',     condition: (xp) => xp >= 500 },
  { id: 'js_master',      label: '🏆 JS Master',         condition: (xp, completedCount) => completedCount >= 15 },
];

// GET /api/challenges?courseId=&levelNum=
const getChallenges = async (req, res) => {
  try {
    const { courseId, levelNum } = req.query;
    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (levelNum) filter.levelNum = Number(levelNum);

    const challenges = await Challenge.find(filter).sort({ order: 1 });

    // Attach completion status for the requesting user
    const challengeIds = challenges.map(c => c._id);
    const progresses = await Progress.find({ userId: req.user._id, challengeId: { $in: challengeIds } });
    const progressMap = {};
    progresses.forEach(p => { progressMap[p.challengeId.toString()] = p.completed; });

    const result = challenges.map(ch => ({
      ...ch.toObject(),
      completed: !!progressMap[ch._id.toString()],
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/challenges/:id
const getChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    const prog = await Progress.findOne({ userId: req.user._id, challengeId: challenge._id });
    res.json({ ...challenge.toObject(), completed: prog?.completed || false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/challenges/:id/submit
const submitChallenge = async (req, res) => {
  try {
    const { code } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    // Check if already completed
    const existingProgress = await Progress.findOne({ userId: req.user._id, challengeId: challenge._id });
    const alreadyCompleted = existingProgress?.completed;

    // Get course info to determine language
    const course = await Course.findById(challenge.courseId);
    const isHTML = course && course.language === 'html';

    // Run tests
    const testResults = runUserCode(code, challenge.functionName, challenge.testCases, isHTML);
    const allPassed = testResults.every(r => r.passed);

    if (!allPassed) {
      return res.json({ success: false, testResults, message: 'Some test cases failed. Keep trying!' });
    }

    // Award XP only if not already completed
    let newBadges = [];
    let levelBonus = 0;
    let levelUnlocked = null;
    let user = await User.findById(req.user._id);

    if (!alreadyCompleted) {
      // Save/update progress
      await Progress.findOneAndUpdate(
        { userId: req.user._id, challengeId: challenge._id },
        { userId: req.user._id, challengeId: challenge._id, courseId: challenge.courseId,
          levelNum: challenge.levelNum, completed: true, submittedCode: code, completedAt: new Date() },
        { upsert: true, new: true }
      );

      // Award XP for this challenge
      user.xp += challenge.xpReward;

      // Update streak
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const lastDate = user.lastChallengeDate ? new Date(user.lastChallengeDate) : null;
      if (lastDate) lastDate.setHours(0, 0, 0, 0);
      if (!lastDate || lastDate.getTime() < todayDate.getTime()) {
        if (lastDate && lastDate.getTime() === todayDate.getTime() - 86400000) {
          user.streak = (user.streak || 0) + 1;
        } else if (!lastDate || lastDate.getTime() < todayDate.getTime() - 86400000) {
          user.streak = 1;
        }
        if (user.streak > (user.maxStreak || 0)) user.maxStreak = user.streak;
        user.lastChallengeDate = new Date();
      }

      // Check if entire level is now completed → bonus XP + next level unlock
      const allLevelChallenges = await Challenge.find({ courseId: challenge.courseId, levelNum: challenge.levelNum });
      const completedInLevel = await Progress.countDocuments({
        userId: req.user._id,
        courseId: challenge.courseId,
        levelNum: challenge.levelNum,
        completed: true,
      });

      if (completedInLevel >= allLevelChallenges.length) {
        levelBonus = 50; // Bonus for completing full level
        user.xp += levelBonus;
        levelUnlocked = challenge.levelNum + 1;

        // Update user's level if appropriate
        if (levelUnlocked > user.level) {
          user.level = Math.min(levelUnlocked, 5);
        }
      }

      // Award badges
      const totalCompleted = await Progress.countDocuments({ userId: req.user._id, completed: true });
      for (const badge of BADGES) {
        if (!user.badges.includes(badge.id) && badge.condition(user.xp, totalCompleted + 1, levelUnlocked)) {
          user.badges.push(badge.id);
          newBadges.push({ id: badge.id, label: badge.label });
        }
      }

      // XP milestone badges
      if (user.xp >= 100 && !user.badges.includes('xp_100')) { user.badges.push('xp_100'); newBadges.push({ id: 'xp_100', label: '⚡ 100 XP Club' }); }
      if (user.xp >= 500 && !user.badges.includes('xp_500')) { user.badges.push('xp_500'); newBadges.push({ id: 'xp_500', label: '🚀 500 XP Legend' }); }
      if ((totalCompleted + 1) === 1 && !user.badges.includes('first_blood')) { user.badges.push('first_blood'); newBadges.push({ id: 'first_blood', label: '🩸 First Blood' }); }

      await user.save();

      // Update CourseProgress for this course
      if (challenge.courseId) {
        // Calculate total challenges in this course
        const allCourseChallenges = await Challenge.find({ courseId: challenge.courseId });
        const completedInCourse = await Progress.countDocuments({
          userId: req.user._id,
          courseId: challenge.courseId,
          completed: true,
        });
        const completionPercentage = allCourseChallenges.length > 0 
          ? Math.round((completedInCourse / allCourseChallenges.length) * 100)
          : 0;

        const newCurrentLevel = levelUnlocked || challenge.levelNum;
        const updateData = {
          userId: req.user._id,
          courseId: challenge.courseId,
          lastAccessedAt: new Date(),
          totalChallengesCompleted: completedInCourse,
          completionPercentage,
          currentLevel: newCurrentLevel,
          status: completionPercentage === 100 ? 'completed' : 'in-progress'
        };

        await CourseProgress.findOneAndUpdate(
          { userId: req.user._id, courseId: challenge.courseId },
          updateData,
          { upsert: true, new: true }
        );
      }
    } else {
      // Update code even if already completed
      await Progress.findOneAndUpdate(
        { userId: req.user._id, challengeId: challenge._id },
        { submittedCode: code }
      );
    }

    // Calculate current streak for response
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const recentProgress = await Progress.find({
      userId: req.user._id,
      completed: true,
    }).sort({ completedAt: -1 }).select('completedAt');

    let currentStreak = 0;
    if (recentProgress.length > 0) {
      const activeDays = new Set();
      recentProgress.forEach(p => {
        if (p.completedAt) {
          const d = new Date(p.completedAt);
          d.setHours(0, 0, 0, 0);
          activeDays.add(d.getTime());
        }
      });

      const checkDate = new Date(today);
      // Check if today has activity; if not, start from yesterday
      if (!activeDays.has(checkDate.getTime())) {
        checkDate.setDate(checkDate.getDate() - 1);
      }
      while (activeDays.has(checkDate.getTime())) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    res.json({
      success: true,
      testResults,
      message: alreadyCompleted ? 'Already completed! Great work!' : 'All tests passed! 🎉',
      xpEarned: alreadyCompleted ? 0 : challenge.xpReward,
      levelBonus: alreadyCompleted ? 0 : levelBonus,
      levelUnlocked,
      newBadges,
      totalXP: user.xp,
      alreadyCompleted,
      streak: currentStreak,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getChallenges, getChallenge, submitChallenge };
