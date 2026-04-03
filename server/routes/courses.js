const express = require('express');
const router = express.Router();
const { getCourses, getCourse, getCourseUserProgress } = require('../controllers/courseController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getCourses);
router.get('/:id', protect, getCourse);
router.get('/:id/user-progress', protect, getCourseUserProgress);

module.exports = router;
