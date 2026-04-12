const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { applyForJob, getMyApplications } = require('../controllers/applicationController');

router.route('/')
  .post(protect, upload.single('resume'), applyForJob)
  .get(protect, getMyApplications);

module.exports = router;