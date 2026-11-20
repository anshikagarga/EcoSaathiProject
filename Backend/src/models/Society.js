const mongoose = require('mongoose');

const societySchema = new mongoose.Schema(
  {
    societyName: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Society', societySchema);
