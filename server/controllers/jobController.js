const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');

const getJobs = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } },
          { location: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const jobs = await Job.find({ ...keyword }).populate('employer', 'name company email');
  res.json(jobs);
});

const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('employer', 'name company email');
  if (job) {
    res.json(job);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

const createJob = asyncHandler(async (req, res) => {
  const { title, description, location, salary, type } = req.body;
  const job = await Job.create({
    employer: req.user._id,
    title,
    description,
    location,
    salary,
    type,
  });
  res.status(201).json(job);
});

const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (job && job.employer.toString() === req.user._id.toString()) {
    job.title = req.body.title || job.title;
    job.description = req.body.description || job.description;
    job.location = req.body.location || job.location;
    job.salary = req.body.salary || job.salary;
    job.type = req.body.type || job.type;
    const updatedJob = await job.save();
    res.json(updatedJob);
  } else {
    res.status(404);
    throw new Error('Job not found or not authorized');
  }
});

// @desc    Delete job
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (job && job.employer.toString() === req.user._id.toString()) {
    await job.deleteOne(); // ✅ Use deleteOne() instead of remove()
    res.json({ message: 'Job removed' });
  } else {
    res.status(404);
    throw new Error('Job not found or not authorized');
  }
});

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob };