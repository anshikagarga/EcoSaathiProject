const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ status: 'error', message: 'Name must be at least 2 characters long' });
  }
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ status: 'error', message: 'Please provide a valid email address' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ status: 'error', message: 'Password must be at least 6 characters long' });
  }
  next();
};

const validateIssue = (req, res, next) => {
  const { issueType, description } = req.body;
  if (!issueType || !description || description.trim().length < 5) {
    return res.status(400).json({ status: 'error', message: 'Valid issueType and description (min 5 chars) are required' });
  }
  next();
};

module.exports = { validateRegister, validateIssue };
