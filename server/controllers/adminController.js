import User from '../models/User.js'
import TutorProfile from '../models/TutorProfile.js'
import Booking from '../models/Booking.js'
import Subject from '../models/Subject.js'
import Complaint from '../models/Complaint.js'

export const getStats = async (req, res) => {
  try {
    const [students, tutors, bookings, pendingTutors] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'tutor' }),
      Booking.countDocuments(),
      TutorProfile.countDocuments({ isApproved: false })
    ])
    res.json({ students, tutors, bookings, pendingTutors })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getAllTutors = async (req, res) => {
  try {
    const profiles = await TutorProfile.find().populate('user', 'name email')
    res.json(profiles)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('student', 'name email')
      .populate('tutor', 'name email')
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const approveTutor = async (req, res) => {
  try {
    const profile = await TutorProfile.findOneAndUpdate(
      { user: req.params.id }, { isApproved: true }, { new: true }
    )
    res.json(profile)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const rejectTutor = async (req, res) => {
  try {
    const profile = await TutorProfile.findOneAndUpdate(
      { user: req.params.id }, { isApproved: false }, { new: true }
    )
    res.json(profile)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── SUBJECTS ────────────────────────────────────────────
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 })
    res.json(subjects)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const addSubject = async (req, res) => {
  try {
    const subject = await Subject.create({ name: req.body.name })
    res.status(201).json(subject)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id)
    res.json({ message: 'Subject deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const toggleSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
    subject.isActive = !subject.isActive
    await subject.save()
    res.json(subject)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── ACTIVITY REPORT ─────────────────────────────────────
export const getActivityReport = async (req, res) => {
  try {
    // Bookings per day (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const bookingsByDay = await Booking.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ])

    // Bookings by status
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    // New users per day (last 7 days)
    const usersByDay = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ])

    res.json({ bookingsByDay, bookingsByStatus, usersByDay })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── COMPLAINTS ───────────────────────────────────────────
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('raisedBy', 'name email role')
      .populate('against',  'name email role')
      .sort({ createdAt: -1 })
    res.json(complaints)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, adminNote: req.body.adminNote },
      { new: true }
    )
    res.json(complaint)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}