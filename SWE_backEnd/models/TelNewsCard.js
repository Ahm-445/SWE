const mongoose = require('mongoose');

const telNewsCardSchema = new mongoose.Schema({
  telId: { type: Number, required: true, unique: true },
  chatId: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: null },
  category: { type: String, default: 'Main News' },
  postedAt: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TelNewsCard', telNewsCardSchema);