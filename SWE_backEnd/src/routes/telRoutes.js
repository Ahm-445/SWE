const express = require('express');
const router = express.Router();
const telController = require('../controllers/telController');

router.post('/webhook', (req, res, next) => {
  const expectedToken = process.env.TELEGRAM_WEBHOOK_SECRET;
  const receivedToken = req.get('x-telegram-bot-api-secret-token');

  if (!expectedToken || receivedToken !== expectedToken) {
    return res.sendStatus(401);
  }

  next();
}, telController.handleWebhook);
router.get('/cards', telController.getNewsCards);

module.exports = router;
