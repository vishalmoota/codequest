const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/aiChatController');

// Rate limiting — 30 requests per minute per IP
let rateLimit;
try {
  const { rateLimit: rl } = require('express-rate-limit');
  rateLimit = rl;
} catch (e) {
  // express-rate-limit not available, skip
}

if (rateLimit) {
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { error: 'Too many requests. Please wait a minute before trying again.' },
    standardHeaders: true,
    legacyHeaders: false
  });
  router.use(limiter);
}

router.post('/chat', chatWithAI);

module.exports = router;