const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');
const Challenge = require('../models/Challenge');

// GET /api/courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/courses/:id
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
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
