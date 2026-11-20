const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    wasteType: { type: String, required: true },
    collectionDate: { type: String, required: true },
    collectionTime: { type: String, required: true },
    instructions: { type: String, default: '' },
    society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Schedule', scheduleSchema);
