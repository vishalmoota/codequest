const express = require('express');
const router = express.Router();
const { getCourses, getCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getCourses);
router.get('/:id', protect, getCourse);

module.exports = router;
