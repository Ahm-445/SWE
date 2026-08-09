const express = require('express');
const router = express.Router();
const telController = require('../controllers/telController');

router.post('/webhook', telController.handleWebhook);
router.get('/cards', telController.getNewsCards);

module.exports = router;