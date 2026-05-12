import express from 'express'
import { createNote, getStudentProgress, getTutorNotes } from '../controllers/progressController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()
router.post('/',        protect, createNote)
router.get('/student',  protect, getStudentProgress)
router.get('/tutor',    protect, getTutorNotes)
export default router