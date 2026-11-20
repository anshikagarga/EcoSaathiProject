const express = require('express');
const router = express.Router();
const { createIssue, getAllIssues, getIssueById, updateIssueStatus } = require('../controllers/issueController');

router.get('/', getAllIssues);
router.get('/my', getAllIssues);
router.post('/', createIssue);
router.get('/:id', getIssueById);
router.patch('/:id/status', updateIssueStatus);

module.exports = router;
