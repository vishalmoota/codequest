const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');
const Challenge = require('../models/Challenge');

const CERTIFICATE_LEVEL = {
  levelNum: 6,
  title: 'Completion Certificate',
  icon: '🏅',
  description: 'Unlock this final level after completing every theory chapter and challenge in the course.',
  theory: {
    title: 'Course Completion Certificate',
    emoji: '🏅',
    description: 'You have finished every level in this course. Download your certificate to save or print your achievement.',
    topics: [
      {
        name: 'Certificate Unlocked',
        emoji: '🏆',
        content: 'Your certificate proves you completed all theory and challenges in this course.',
        keyRules: ['Complete every level and challenge to unlock the certificate.'],
      },
    ],
    quickQuiz: [],
    references: [],
  },
  theoryLegacy: 'Course completion certificate',
};

const withCertificateLevel = (courseDoc) => {
  const course = typeof courseDoc.toObject === 'function' ? courseDoc.toObject() : { ...courseDoc };

  if (Array.isArray(course.levels) && !course.levels.some((level) => level.levelNum === CERTIFICATE_LEVEL.levelNum)) {
    course.levels = [...course.levels, CERTIFICATE_LEVEL];
  }

  return course;
};

// GET /api/courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses.map(withCertificateLevel));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/courses/:id
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(withCertificateLevel(course));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/courses/:id/user-progress - Get user's progress in a course including last accessed challenge
const getCourseUserProgress = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const courseProgress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: req.params.id
    }).populate('lastAccessedChallengeId');

    if (!courseProgress) {
      // Not enrolled or no progress yet
      return res.json({
        enrolled: false,
        lastAccessedChallengeId: null,
        lastAccessedLevel: null,
        completionPercentage: 0,
        totalChallengesCompleted: 0
      });
    }

    res.json({
      enrolled: true,
      lastAccessedChallengeId: courseProgress.lastAccessedChallengeId?._id || null,
      lastAccessedLevel: courseProgress.lastAccessedLevel || 1,
      completionPercentage: courseProgress.completionPercentage || 0,
      totalChallengesCompleted: courseProgress.totalChallengesCompleted || 0,
      currentLevel: courseProgress.currentLevel || 1
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCourses, getCourse, getCourseUserProgress };
