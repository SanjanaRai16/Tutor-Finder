import express from 'express'
import {
  getStats, getAllTutors, getAllUsers, getAllBookings,
  approveTutor, rejectTutor,
  getSubjects, addSubject, deleteSubject, toggleSubject,
  getActivityReport,
  getAllComplaints, resolveComplaint
} from '../controllers/adminController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()
router.use(protect, adminOnly)

router.get('/stats',                  getStats)
router.get('/tutors',                 getAllTutors)
router.get('/users',                  getAllUsers)
router.get('/bookings',               getAllBookings)
router.patch('/tutors/:id/approve',   approveTutor)
router.patch('/tutors/:id/reject',    rejectTutor)

router.get('/subjects',               getSubjects)
router.post('/subjects',              addSubject)
router.delete('/subjects/:id',        deleteSubject)
router.patch('/subjects/:id/toggle',  toggleSubject)

router.get('/activity',               getActivityReport)

router.get('/complaints',             getAllComplaints)
router.patch('/complaints/:id',       resolveComplaint)

export default router