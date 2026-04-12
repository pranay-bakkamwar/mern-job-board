const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const sendEmail = require('../utils/sendEmail');

const applyForJob = asyncHandler(async (req, res) => {
  const { jobId, coverLetter } = req.body;

  // Check if file was uploaded
  if (!req.file) {
    res.status(400);
    throw new Error('Resume file is required');
  }

  const resume = req.file.path; // Local file path (or Cloudinary URL)

  const alreadyApplied = await Application.findOne({ job: jobId, candidate: req.user._id });
  if (alreadyApplied) {
    res.status(400);
    throw new Error('You have already applied for this job');
  }

  const application = await Application.create({
    job: jobId,
    candidate: req.user._id,
    resume,
    coverLetter,
  });

  try {
    await sendEmail({
      email: req.user.email,
      subject: 'Application Submitted',
      message: `You have successfully applied for the job.`,
    });
  } catch (error) {
    console.log('Email error:', error);
  }

  res.status(201).json(application);
});

const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id }).populate('job', 'title company');
  res.json(applications);
});

module.exports = { applyForJob, getMyApplications };