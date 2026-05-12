import Complaint from '../models/Complaint.js'

export const createComplaint = async (req, res) => {
  try {
    console.log("USER:", req.user)   // 👈 ADD THIS

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - no user' })
    }

    const { against, subject, message } = req.body

   const complaint = await Complaint.create({
  raisedBy: req.user.id,
  against: against || null,   // ✅ FIX HERE
  subject,
  message
})

    res.status(201).json(complaint)
  } catch (err) {
    console.error("ERROR:", err)  // 👈 ADD THIS
    res.status(500).json({ message: err.message })
  }
}
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ raisedBy: req.user.id })
      .populate('against', 'name email')
      .sort({ createdAt: -1 })
    res.json(complaints)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}