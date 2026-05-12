// import Booking from '../models/Booking.js'

// export const createBooking = async (req, res) => {
//   try {
//     const { tutorId, slot } = req.body
//     const booking = await Booking.create({
//       student: req.user.id, tutor: tutorId, slot
//     })
//     res.status(201).json(booking)
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

// export const getMyBookings = async (req, res) => {
//   try {
//     const filter = req.user.role === 'student'
//       ? { student: req.user.id }
//       : { tutor: req.user.id }
//     const bookings = await Booking.find(filter)
//       .populate('student', 'name email')
//       .populate('tutor', 'name email')
//       .sort({ createdAt: -1 })
//     res.json(bookings)
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

// export const updateBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id)
//     if (!booking) return res.status(404).json({ message: 'Booking not found' })
//     booking.status = req.body.status
//     await booking.save()
//     res.json(booking)
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }
import Booking from '../models/Booking.js'

export const createBooking = async (req, res) => {
  try {
    const { tutorId, slot, isTrial } = req.body

    // Check if student already had a trial with this tutor
    if (isTrial) {
      const existingTrial = await Booking.findOne({
        student: req.user.id,
        tutor: tutorId,
        isTrial: true
      })
      if (existingTrial)
        return res.status(400).json({ message: 'You already had a trial session with this tutor' })
    }

    const booking = await Booking.create({
      student: req.user.id,
      tutor: tutorId,
      slot,
      isTrial: isTrial || false,
      duration: isTrial ? 15 : 60
    })
    res.status(201).json(booking)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getMyBookings = async (req, res) => {
  try {
    const filter = req.user.role === 'student'
      ? { student: req.user.id }
      : { tutor: req.user.id }
    const bookings = await Booking.find(filter)
      .populate('student', 'name email')
      .populate('tutor',   'name email')
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    booking.status = req.body.status
    await booking.save()
    res.json(booking)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}