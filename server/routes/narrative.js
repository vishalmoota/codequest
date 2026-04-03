const express = require('express');
const router = express.Router();
const {
  getNarrative,
  getChapter,
  updateNarrativeProgress,
  getUserProgress
} = require('../controllers/narrativeController');
const { protect } = require('../middleware/auth');

router.get('/course/:courseId', protect, getNarrative);
router.get('/course/:courseId/chapter/:chapterNum', protect, getChapter);
router.post('/progress', protect, updateNarrativeProgress);
router.get('/user-progress', protect, getUserProgress);

module.exports = router;
