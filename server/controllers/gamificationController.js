const User = require('../models/User');
const DailyChallenge = require('../models/DailyChallenge');
const Challenge = require('../models/Challenge');
const Progress = require('../models/Progress');
const CourseProgress = require('../models/CourseProgress');
const Course = require('../models/Course');

// BADGES awarded after XP milestones or special actions
const BADGES = [
  { id: 'first_blood',     label: '🩸 First Blood',       condition: (u) => true },   // first challenge
  { id: 'xp_100',          label: '⚡ 100 XP Club',       condition: (u) => u.xp >= 100 },
  { id: 'xp_500',          label: '🚀 500 XP Legend',     condition: (u) => u.xp >= 500 },
  { id: 'xp_1000',         label: '💎 1K XP Master',      condition: (u) => u.xp >= 1000 },
  { id: 'streak_3',        label: '🔥 3-Day Streak',      condition: (u) => u.streak >= 3 },
  { id: 'streak_7',        label: '🔥 Week Warrior',      condition: (u) => u.streak >= 7 },
  { id: 'streak_30',       label: '🔥 Monthly Legend',     condition: (u) => u.streak >= 30 },
  { id: 'battle_won',      label: '⚔️ Battle Victor',     condition: (u) => true },   // first battle win
  { id: 'daily_first',     label: '☀️ Daily Solver',      condition: (u) => true },   // first daily challenge
  { id: 'enrolled_3',      label: '📚 Triple Learner',    condition: (u) => (u.enrolledCourses?.length || 0) >= 3 },
];

function awardBadges(user, specialIds = []) {
  const newBadges = [];
  for (const b of BADGES) {
    if (user.badges.includes(b.id)) continue;
    if (specialIds.includes(b.id) || b.condition(user)) {
      user.badges.push(b.id);
      newBadges.push({ id: b.id, label: b.label });
    }
  }
  return newBadges;
}

// GET /api/gamification/streak
const getStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      streak: user.streak,
      maxStreak: user.maxStreak,
      lastChallengeDate: user.lastChallengeDate,
      currentDayStreak: user.currentDayStreak
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/gamification/daily-challenge
const getDailyChallenge = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dailyChallenge = await DailyChallenge.findOne({
      date: { $gte: today, $lt: tomorrow }
    }).populate('challengeId');

    // Create a new daily challenge if it doesn't exist
    if (!dailyChallenge) {
      const randomChallenge = await Challenge.aggregate([
        { $sample: { size: 1 } }
      ]);

      if (randomChallenge.length > 0) {
        dailyChallenge = await DailyChallenge.create({
          date: today,
          challengeId: randomChallenge[0]._id,
          difficulty: randomChallenge[0].difficulty || 'medium',
          xpReward: 50,
          bonusXP: 25,
          theme: 'Daily Challenge'
        });
        dailyChallenge = await dailyChallenge.populate('challengeId');
      }
    }

    res.json(dailyChallenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update streak after challenge completion
const updateStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastChallengeDate = user.lastChallengeDate ? new Date(user.lastChallengeDate) : null;
    const lastDate = lastChallengeDate ? new Date(lastChallengeDate) : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    let streak = user.streak || 0;
    let currentDay = user.currentDayStreak || 0;

    if (!lastDate || lastDate.getTime() < today.getTime()) {
      // Different day - increment streak or reset
      if (lastDate && lastDate.getTime() === today.getTime() - 86400000) {
        // Consecutive day
        streak += 1;
        currentDay += 1;
      } else {
        // Gap in streak - reset
        streak = 1;
        currentDay = 1;
      }

      user.streak = streak;
      user.currentDayStreak = currentDay;
      if (streak > user.maxStreak) user.maxStreak = streak;
      user.lastChallengeDate = new Date();
      await user.save();
    }

    res.json({
      streak: user.streak,
      maxStreak: user.maxStreak,
      currentDayStreak: user.currentDayStreak
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/gamification/avatar
const getAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.avatar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/gamification/avatar
const updateAvatar = async (req, res) => {
  try {
    const { character, color, skinTone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'avatar.character': character || user.avatar.character,
        'avatar.color': color || user.avatar.color,
        'avatar.skinTone': skinTone || user.avatar.skinTone
      },
      { new: true }
    );
    res.json(user.avatar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/gamification/daily-challenge/complete
const completeDailyChallenge = async (req, res) => {
  try {
    const { code } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailyChallenge = await DailyChallenge.findOne({
      date: { $gte: today, $lt: tomorrow }
    }).populate('challengeId');

    if (!dailyChallenge || !dailyChallenge.challengeId) {
      return res.status(404).json({ message: 'No daily challenge found for today' });
    }

    // Check if user already completed today's daily
    const alreadyDone = dailyChallenge.completions?.some(
      c => c.userId.toString() === req.user._id.toString()
    );

    const challenge = dailyChallenge.challengeId;

    // Run tests against the challenge
    const runUserCode = (userCode, functionName, testCases) => {
      const results = [];
      for (const tc of testCases) {
        try {
          const wrapped = new Function(`${userCode}\n return ${functionName}(...arguments);`);
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

    const testResults = runUserCode(code, challenge.functionName, challenge.testCases);
    const allPassed = testResults.every(r => r.passed);

    if (!allPassed) {
      return res.json({ success: false, testResults, message: 'Some test cases failed. Keep trying!' });
    }

    let user = await User.findById(req.user._id);
    let xpEarned = 0;
    let newBadges = [];

    if (!alreadyDone) {
      xpEarned = dailyChallenge.xpReward || 50;
      // Bonus XP if first completion
      if (dailyChallenge.completions.length === 0) {
        xpEarned += dailyChallenge.bonusXP || 25;
      }
      user.xp += xpEarned;

      // Record completion
      dailyChallenge.completions.push({
        userId: req.user._id,
        completedAt: new Date(),
        attempts: 1,
        timeSpent: 0,
      });
      await dailyChallenge.save();

      // Also save as regular progress
      await Progress.findOneAndUpdate(
        { userId: req.user._id, challengeId: challenge._id },
        { userId: req.user._id, challengeId: challenge._id, courseId: challenge.courseId,
          levelNum: challenge.levelNum, completed: true, submittedCode: code, completedAt: new Date() },
        { upsert: true, new: true }
      );

      // Update streak
      const lastDate = user.lastChallengeDate ? new Date(user.lastChallengeDate) : null;
      if (lastDate) lastDate.setHours(0, 0, 0, 0);
      if (!lastDate || lastDate.getTime() < today.getTime()) {
        if (lastDate && lastDate.getTime() === today.getTime() - 86400000) {
          user.streak = (user.streak || 0) + 1;
        } else if (!lastDate || lastDate.getTime() < today.getTime() - 86400000) {
          user.streak = 1;
        }
        if (user.streak > (user.maxStreak || 0)) user.maxStreak = user.streak;
        user.lastChallengeDate = new Date();
      }

      // Award badges
      newBadges = awardBadges(user, ['daily_first']);
      await user.save();
    }

    res.json({
      success: true,
      testResults,
      xpEarned,
      totalXP: user.xp,
      alreadyCompleted: alreadyDone,
      newBadges,
      streak: user.streak,
      message: alreadyDone ? 'Already completed today!' : `Daily challenge complete! +${xpEarned} XP 🎉`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/gamification/battle-complete
const completeBattle = async (req, res) => {
  try {
    const { xpReward, won } = req.body;
    let user = await User.findById(req.user._id);
    let xpEarned = 0;

    if (won) {
      xpEarned = xpReward || 50;
      user.xp += xpEarned;

      // Update streak 
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastDate = user.lastChallengeDate ? new Date(user.lastChallengeDate) : null;
      if (lastDate) lastDate.setHours(0, 0, 0, 0);
      if (!lastDate || lastDate.getTime() < today.getTime()) {
        if (lastDate && lastDate.getTime() === today.getTime() - 86400000) {
          user.streak = (user.streak || 0) + 1;
        } else if (!lastDate || lastDate.getTime() < today.getTime() - 86400000) {
          user.streak = 1;
        }
        if (user.streak > (user.maxStreak || 0)) user.maxStreak = user.streak;
        user.lastChallengeDate = new Date();
      }

      const newBadges = awardBadges(user, ['battle_won']);
      await user.save();

      return res.json({
        success: true,
        xpEarned,
        totalXP: user.xp,
        streak: user.streak,
        newBadges,
        message: `Victory! +${xpEarned} XP`,
      });
    }

    res.json({ success: false, xpEarned: 0, totalXP: user.xp, streak: user.streak, newBadges: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/gamification/enroll
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;
    
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already enrolled
    const courseIdStr = courseId.toString();
    const isEnrolled = user.enrolledCourses.some(id => id.toString() === courseIdStr);
    
    if (isEnrolled) {
      return res.json({ 
        message: 'Already enrolled', 
        enrolledCourses: user.enrolledCourses,
        newBadges: []
      });
    }

    // Add course to enrolledCourses
    user.enrolledCourses.push(courseId);

    // Award badges for enrollment
    const newBadges = awardBadges(user, []);
    
    await user.save();

    // Create CourseProgress record
    await CourseProgress.findOneAndUpdate(
      { userId, courseId },
      {
        userId,
        courseId,
        enrolledAt: new Date(),
        lastAccessedAt: new Date(),
        currentLevel: 1,
        status: 'in-progress'
      },
      { upsert: true, new: true }
    );

    // Populate to return full courseId objects
    await user.populate('enrolledCourses', 'title description language');

    res.json({
      message: 'Enrolled successfully!',
      enrolledCourses: user.enrolledCourses,
      newBadges
    });
  } catch (err) {
    console.error('Enrollment error:', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/gamification/enrolled-courses
const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user with populated enrolled courses
    const user = await User.findById(userId)
      .populate('enrolledCourses', 'title description language levels');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get progress for each enrolled course
    const coursesWithProgress = await Promise.all(
      (user.enrolledCourses || []).map(async (course) => {
        const courseProgress = await CourseProgress.findOne({
          userId,
          courseId: course._id
        });

        return {
          ...course.toObject(),
          progress: courseProgress || {
            enrolledAt: new Date(),
            currentLevel: 1,
            completionPercentage: 0,
            totalChallengesCompleted: 0,
            status: 'in-progress'
          }
        };
      })
    );

    res.json(coursesWithProgress);
  } catch (err) {
    console.error('Error fetching enrolled courses:', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/gamification/course-progress/:courseId
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const courseProgress = await CourseProgress.findOne({
      userId,
      courseId
    }).populate('courseId', 'title description language levels');

    if (!courseProgress) {
      return res.status(404).json({ message: 'Course progress not found' });
    }

    res.json(courseProgress);
  } catch (err) {
    console.error('Error fetching course progress:', err);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/gamification/course-progress/:courseId
const updateCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { currentLevel, completionPercentage, status, theoryCompleted, action, lastAccessedChallengeId, lastAccessedLevel } = req.body;
    const userId = req.user._id;

    let updateData = {
      lastAccessedAt: new Date(),
      ...(currentLevel && { currentLevel }),
      ...(typeof completionPercentage === 'number' && { completionPercentage }),
      ...(status && { status }),
      ...(lastAccessedChallengeId && { lastAccessedChallengeId }),
      ...(lastAccessedLevel && { lastAccessedLevel })
    };

    // Handle theory completion
    if (action === 'complete-theory' && theoryCompleted) {
      const courseProgress = await CourseProgress.findOne({ userId, courseId });
      if (courseProgress) {
        // Add level to theoryCompleted array if not already there
        if (!courseProgress.theoryCompleted.includes(theoryCompleted)) {
          courseProgress.theoryCompleted.push(theoryCompleted);
          updateData.theoryCompleted = courseProgress.theoryCompleted;
        }
      } else {
        updateData.theoryCompleted = [theoryCompleted];
      }
    }

    const updated = await CourseProgress.findOneAndUpdate(
      { userId, courseId },
      updateData,
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    console.error('Error updating course progress:', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/gamification/activity-days
const getActivityDays = async (req, res) => {
  try {
    const daysBack = parseInt(req.query.days) || 35;
    const since = new Date();
    since.setDate(since.getDate() - daysBack);
    since.setHours(0, 0, 0, 0);

    const activity = await Progress.find({
      userId: req.user._id,
      completed: true,
      completedAt: { $gte: since },
    }).select('completedAt');

    const dayStrings = [...new Set(activity.map(p => {
      const d = new Date(p.completedAt);
      d.setHours(0, 0, 0, 0);
      return d.toISOString().split('T')[0];
    }))];

    res.json({ activityDays: dayStrings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getStreak,
  getDailyChallenge,
  completeDailyChallenge,
  completeBattle,
  updateStreak,
  getAvatar,
  updateAvatar,
  enrollCourse,
  getEnrolledCourses,
  getCourseProgress,
  updateCourseProgress,
  getActivityDays,
};
