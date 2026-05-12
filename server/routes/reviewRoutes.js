import express from 'express'
import { createReview, getTutorReviews } from '../controllers/reviewController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()
router.post('/',              protect, createReview)
router.get('/tutor/:tutorId', getTutorReviews)
export default router