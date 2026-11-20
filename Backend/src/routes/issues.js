const express = require('express');
const router = express.Router();

let issues = [
  {
    id: 1,
    issueType: 'Missed Pickup',
    description: 'Morning garbage pickup was missed in Block A.',
    reportedBy: 'Rahul Sharma',
    status: 'SUBMITTED',
    createdAt: new Date().toISOString()
  }
];

router.get('/', (req, res) => {
  res.json({ status: 'success', count: issues.length, data: issues });
});

router.post('/', (req, res) => {
  const { issueType, description, reportedBy } = req.body;

  if (!issueType || !description) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide issueType and description.'
    });
  }

  const newIssue = {
    id: issues.length + 1,
    issueType,
    description,
    reportedBy: reportedBy || 'Resident',
    status: 'SUBMITTED',
    createdAt: new Date().toISOString()
  };

  issues.push(newIssue);
  res.status(201).json({ status: 'success', data: newIssue });
});

module.exports = router;

