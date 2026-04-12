const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, employerOnly } = require('../middleware/authMiddleware');

router.route('/').get(getJobs).post(protect, employerOnly, createJob);
router.route('/:id').get(getJobById).put(protect, employerOnly, updateJob).delete(protect, employerOnly, deleteJob);

module.exports = router;