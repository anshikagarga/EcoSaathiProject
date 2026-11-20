const mongoose = require('mongoose');

const issueReportSchema = new mongoose.Schema(
  {
    issueType: { type: String, required: true },
    description: { type: String, required: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society' },
    status: { type: String, enum: ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'RESOLVED', 'REJECTED'], default: 'SUBMITTED' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('IssueReport', issueReportSchema);
