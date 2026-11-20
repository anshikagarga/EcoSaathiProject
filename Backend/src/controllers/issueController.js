const IssueReport = require('../models/IssueReport');

let tempIssues = [
  { id: 1, issueType: 'Missed Pickup', description: 'Morning garbage pickup was missed in Block A.', reportedBy: 'Rahul Sharma', status: 'SUBMITTED', createdAt: new Date().toISOString() }
];

exports.createIssue = async (req, res) => {
  try {
    const { issueType, description, reportedBy } = req.body;
    if (!issueType || !description) return res.status(400).json({ status: 'error', message: 'issueType and description are required' });
    if (!process.env.MONGO_URI) {
      const newIssue = { id: tempIssues.length + 1, issueType, description, reportedBy: reportedBy || 'Resident', status: 'SUBMITTED', createdAt: new Date().toISOString() };
      tempIssues.push(newIssue);
      return res.status(201).json({ status: 'success', data: newIssue });
    }
    const issue = await IssueReport.create({ issueType, description, reportedBy: req.user?.id });
    res.status(201).json({ status: 'success', data: issue });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAllIssues = async (req, res) => {
  try {
    if (!process.env.MONGO_URI) return res.json({ status: 'success', count: tempIssues.length, data: tempIssues });
    const issues = await IssueReport.find().sort({ createdAt: -1 });
    res.json({ status: 'success', count: issues.length, data: issues });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getIssueById = async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      const issue = tempIssues.find((i) => i.id === parseInt(req.params.id));
      if (!issue) return res.status(404).json({ status: 'error', message: 'Issue not found' });
      return res.json({ status: 'success', data: issue });
    }
    const issue = await IssueReport.findById(req.params.id);
    if (!issue) return res.status(404).json({ status: 'error', message: 'Issue not found' });
    res.json({ status: 'success', data: issue });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateIssueStatus = async (req, res) => {
  try {
    const validStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'RESOLVED', 'REJECTED', 'REOPENED'];
    const { status } = req.body;
    if (!validStatuses.includes(status)) return res.status(400).json({ status: 'error', message: 'Invalid status value' });
    if (!process.env.MONGO_URI) {
      const issue = tempIssues.find((i) => i.id === parseInt(req.params.id));
      if (!issue) return res.status(404).json({ status: 'error', message: 'Issue not found' });
      issue.status = status;
      return res.json({ status: 'success', data: issue });
    }
    const issue = await IssueReport.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!issue) return res.status(404).json({ status: 'error', message: 'Issue not found' });
    res.json({ status: 'success', data: issue });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
