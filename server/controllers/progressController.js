import ProgressNote from '../models/ProgressNote.js'

export const createNote = async (req, res) => {
  try {
    const note = await ProgressNote.create({
      booking:       req.body.bookingId,
      student:       req.body.studentId,
      tutor:         req.user.id,
      subject:       req.body.subject,
      topicsCovered: req.body.topicsCovered,
      performance:   req.body.performance,
      homework:      req.body.homework,
      notes:         req.body.notes
    })
    res.status(201).json(note)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getStudentProgress = async (req, res) => {
  try {
    const notes = await ProgressNote.find({ student: req.user.id })
      .populate('tutor', 'name')
      .populate('booking')
      .sort({ createdAt: -1 })
    res.json(notes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getTutorNotes = async (req, res) => {
  try {
    const notes = await ProgressNote.find({ tutor: req.user.id })
      .populate('student', 'name')
      .populate('booking')
      .sort({ createdAt: -1 })
    res.json(notes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}