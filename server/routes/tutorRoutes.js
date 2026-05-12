import express from 'express'
import { getAllTutors, getTutorById, getMyProfile, createProfile, updateProfile } from '../controllers/tutorController.js'
import { protect, tutorOnly } from '../middleware/auth.js'

const router = express.Router()
router.get('/',           getAllTutors)
router.get('/my-profile', protect, tutorOnly, getMyProfile)
router.get('/:id',        getTutorById)
router.post('/profile',   protect, tutorOnly, createProfile)
router.put('/profile',    protect, tutorOnly, updateProfile)
export default router