import Review from '../models/Review.js'
import TutorProfile from '../models/TutorProfile.js'

export const createReview = async (req, res) => {
  try {
    const { tutorId, rating, comment } = req.body
    const review = await Review.create({
      student: req.user.id, tutor: tutorId, rating, comment
    })
    const reviews = await Review.find({ tutor: tutorId })
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    await TutorProfile.findOneAndUpdate(
      { user: tutorId },
      { avgRating: avg.toFixed(1), reviewCount: reviews.length }
    )
    await review.populate('student', 'name')
    res.status(201).json(review)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getTutorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tutor: req.params.tutorId })
      .populate('student', 'name')
      .sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}