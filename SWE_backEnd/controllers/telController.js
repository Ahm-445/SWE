const axios = require('axios');
const TelNewsCard = require('../models/TelNewsCard');
const { botToken, targetHashtag } = require('../config/tel');

const extractTitle = (text) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  return lines.length > 0 ? lines[0] : 'Latest Announcement';
};

const getTelFileUrl = async (fileId) => {
  try {
    const res = await axios.get(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
    const filePath = res.data.result.file_path;
    return `https://api.telegram.org/file/bot${botToken}/${filePath}`;
  } catch (err) {
    console.error('Error fetching Telegram photo:', err.message);
    return null;
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const update = req.body;
    const message = update.message || update.edited_message || update.channel_post;

    if (!message || (!message.text && !message.caption)) {
      return res.status(200).send('No text content');
    }

    const rawText = message.text || message.caption || '';

    if (!rawText.toLowerCase().includes(targetHashtag.toLowerCase())) {
      console.log(`[Filtered] Message ${message.message_id} missing ${targetHashtag}`);
      return res.status(200).send('Ignored: missing hashtag');
    }

    const cleanedContent = rawText.replace(new RegExp(targetHashtag, 'gi'), '').trim();

    let imageUrl = null;
    if (message.photo && message.photo.length > 0) {
      const largestPhoto = message.photo[message.photo.length - 1];
      imageUrl = await getTelFileUrl(largestPhoto.file_id);
    }

    const cardData = {
      telId: message.message_id,
      chatId: message.chat.id,
      title: extractTitle(cleanedContent),
      content: cleanedContent,
      imageUrl: imageUrl,
      postedAt: new Date(message.date * 1000)
    };

    const card = await TelNewsCard.findOneAndUpdate(
      { telId: message.message_id },
      cardData,
      { upsert: true, new: true }
    );

    console.log(`[Card Processed] ID: ${message.message_id}`);
    return res.status(200).json({ success: true, card });
  } catch (err) {
    console.error('Webhook Controller Error:', err);
    return res.status(200).send('Error handled');
  }
};

exports.getNewsCards = async (req, res) => {
  try {
    const cards = await TelNewsCard.find().sort({ postedAt: -1 });
    return res.status(200).json({ success: true, count: cards.length, cards });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};