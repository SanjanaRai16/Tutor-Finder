import express from 'express'
import { createBooking, getMyBookings, updateBooking } from '../controllers/bookingController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()
router.post('/',     protect, createBooking)
router.get('/my',    protect, getMyBookings)
router.patch('/:id', protect, updateBooking)
export default router