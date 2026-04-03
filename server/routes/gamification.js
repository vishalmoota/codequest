const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/gamificationController');
const { protect } = require('../middleware/auth');

router.get('/streak', protect, getStreak);
router.get('/daily-challenge', protect, getDailyChallenge);
router.post('/daily-challenge/complete', protect, completeDailyChallenge);
router.post('/battle-complete', protect, completeBattle);
router.post('/update-streak', protect, updateStreak);
router.get('/avatar', protect, getAvatar);
router.put('/avatar', protect, updateAvatar);
router.post('/enroll', protect, enrollCourse);
router.get('/enrolled-courses', protect, getEnrolledCourses);
router.get('/course-progress/:courseId', protect, getCourseProgress);
router.put('/course-progress/:courseId', protect, updateCourseProgress);
router.get('/activity-days', protect, getActivityDays);

module.exports = router;
