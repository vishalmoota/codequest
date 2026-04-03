const Progress = require('../models/Progress');
const Challenge = require('../models/Challenge');
const Course = require('../models/Course');
const User = require('../models/User');
const CourseProgress = require('../models/CourseProgress');

// GET /api/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses', 'title description language');

    // Get all user progress
    const progresses = await Progress.find({ userId: user._id, completed: true })
      .populate('challengeId', 'levelNum xpReward title');

    // Build per-level completion stats
    const levelStats = {};
    for (let i = 1; i <= 5; i++) {
      levelStats[i] = { completed: 0, total: 0 };
    }

    // Get all challenges to understand totals
    const allChallenges = await Challenge.find();
    allChallenges.forEach(ch => {
      if (levelStats[ch.levelNum]) levelStats[ch.levelNum].total++;
    });
    progresses.forEach(p => {
      const lvl = p.challengeId?.levelNum;
      if (lvl && levelStats[lvl]) levelStats[lvl].completed++;
    });

    const totalChallenges = allChallenges.length;
    const completedChallenges = progresses.length;

    // Calculate rank
    const getRank = (xp) => {
      if (xp >= 2000) return { name: 'Diamond', icon: '💎', color: '#b9f2ff' };
      if (xp >= 1000) return { name: 'Platinum', icon: '⚜️', color: '#e5e4e2' };
      if (xp >= 500) return { name: 'Gold', icon: '🥇', color: '#ffd700' };
      if (xp >= 200) return { name: 'Silver', icon: '🥈', color: '#c0c0c0' };
      return { name: 'Bronze', icon: '🥉', color: '#cd7f32' };
    };

    // Calculate activity days (last 35 days) from Progress completedAt
    const thirtyFiveDaysAgo = new Date();
    thirtyFiveDaysAgo.setDate(thirtyFiveDaysAgo.getDate() - 35);
    thirtyFiveDaysAgo.setHours(0, 0, 0, 0);
    const recentActivity = await Progress.find({
      userId: user._id,
      completed: true,
      completedAt: { $gte: thirtyFiveDaysAgo },
    }).select('completedAt');
    const activityDays = [...new Set(recentActivity.map(p => {
      const d = new Date(p.completedAt);
      d.setHours(0, 0, 0, 0);
      return d.toISOString().split('T')[0];
    }))];

    // Recalculate streak from activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daySet = new Set(activityDays);
    let calcStreak = 0;
    const check = new Date(today);
    if (!daySet.has(check.toISOString().split('T')[0])) {
      check.setDate(check.getDate() - 1);
    }
    while (daySet.has(check.toISOString().split('T')[0])) {
      calcStreak++;
      check.setDate(check.getDate() - 1);
    }

    // Get enrolled courses with progress
    const enrolledCoursesWithProgress = await Promise.all(
      (user.enrolledCourses || []).map(async (course) => {
        const courseProgress = await CourseProgress.findOne({
          userId: user._id,
          courseId: course._id
        });

        // Calculate overall completion for this course
        let totalCompleted = 0;
        let totalAvailable = 0;
        if (course.levels && Array.isArray(course.levels)) {
          for (const level of course.levels) {
            const levelChallenges = await Challenge.find({
              courseId: course._id,
              levelNum: level.levelNum
            });
            totalAvailable += levelChallenges.length;
            
            const completedInLevel = await Progress.countDocuments({
              userId: user._id,
              courseId: course._id,
              levelNum: level.levelNum,
              completed: true
            });
            totalCompleted += completedInLevel;
          }
        }

        return {
          _id: course._id,
          title: course.title,
          description: course.description,
          language: course.language,
          enrolledAt: courseProgress?.enrolledAt || new Date(),
          lastAccessedAt: courseProgress?.lastAccessedAt || new Date(),
          currentLevel: courseProgress?.currentLevel || 1,
          completionPercentage: totalAvailable > 0 ? Math.round((totalCompleted / totalAvailable) * 100) : 0,
          totalChallengesCompleted: totalCompleted,
          totalChallenges: totalAvailable,
          status: courseProgress?.status || 'in-progress'
        };
      })
    );

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      xp: user.xp,
      level: user.level,
      badges: user.badges,
      avatar: user.avatar,
      streak: calcStreak,
      maxStreak: user.maxStreak || 0,
      currentDayStreak: user.currentDayStreak || 0,
      lastChallengeDate: user.lastChallengeDate,
      storyChapter: user.storyChapter || 1,
      storylineProgress: user.storylineProgress || 0,
      achievements: user.achievements || [],
      skills: user.skills || [],
      rank: getRank(user.xp),
      completedChallenges,
      totalChallenges,
      levelStats,
      joinedAt: user.createdAt,
      enrolledCourses: enrolledCoursesWithProgress,
      activityDays,
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile };
