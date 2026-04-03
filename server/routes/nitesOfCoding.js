const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getChallengeOverview,
  getChallenge,
  submitChallenge,
} = require('../controllers/nitesOfCodingController');

router.get('/', protect, getChallengeOverview);
router.get('/:day', protect, getChallenge);
router.post('/:day/submit', protect, submitChallenge);

module.exports = router;
