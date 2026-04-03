const express = require('express');
const router = express.Router();
const { getChallenges, getChallenge, submitChallenge } = require('../controllers/challengeController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getChallenges);
router.get('/:id', protect, getChallenge);
router.post('/:id/submit', protect, submitChallenge);

module.exports = router;
