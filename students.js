
const express = require('express');
const Student = require('../models/Student');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Admin: list students (with optional pagination)
router.get('/', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Student.countDocuments();
    const students = await Student.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    res.json({ students, total, page, pages: Math.ceil(total/limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: add student
router.post('/', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, course, enrollmentDate } = req.body;
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Student with email already exists' });
    const student = new Student({ name, email, course, enrollmentDate });
    await student.save();
    res.status(201).json({ student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: update student
router.put('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = (({ name, email, course, enrollmentDate })=>({ name, email, course, enrollmentDate }))(req.body);
    const student = await Student.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Not found' });
    res.json({ student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: delete student
router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Student: view own profile
router.get('/me/profile', authenticate, authorizeRoles('student','admin'), async (req, res) => {
  try {
    // If admin wants to view their own profile too
    const userEmail = req.user.email;
    const student = await Student.findOne({ email: userEmail });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    res.json({ student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Student: update own profile (students only)
router.put('/me/profile', authenticate, authorizeRoles('student'), async (req, res) => {
  try {
    const userEmail = req.user.email;
    const updates = (({ name, email, course })=>({ name, email, course }))(req.body);
    const student = await Student.findOneAndUpdate({ email: userEmail }, updates, { new: true, runValidators: true, upsert: false });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    res.json({ student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
