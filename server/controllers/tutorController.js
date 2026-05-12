import User from '../models/User.js'
import TutorProfile from '../models/TutorProfile.js'

export const getAllTutors = async (req, res) => {
  try {
    const { subject, minRate, maxRate, search } = req.query

    const profileFilter = { isApproved: true }

    if (subject) profileFilter.subjects = subject

    if (minRate || maxRate) {
      profileFilter.hourlyRate = {}
      if (minRate) profileFilter.hourlyRate.$gte = Number(minRate)
      if (maxRate) profileFilter.hourlyRate.$lte = Number(maxRate)
    if (req.query.day) {
  profileFilter['availableSlots.day'] = req.query.day
}}

    const profiles = await TutorProfile.find(profileFilter)
      .populate('user', 'name email profilePic')

    let tutors = profiles
      .filter(p => p.user) // ✅ prevent crash
      .map(p => ({
        _id: p.user._id,
        name: p.user.name,
        email: p.user.email,
        profilePic: p.user.profilePic,
        tutorProfile: p
      }))

    if (search) {
      const q = search.toLowerCase()
      tutors = tutors.filter(t =>
        t.name?.toLowerCase().includes(q)
      )
    }

    res.json(tutors)

  } catch (err) {
    console.error("GET ALL TUTORS ERROR:", err)
    res.status(500).json({ message: err.message })
  }
}
export const getTutorById = async (req, res) => {
  try {
    const user    = await User.findById(req.params.id).select('-password')
    const profile = await TutorProfile.findOne({ user: req.params.id })
    if (!user) return res.status(404).json({ message: 'Tutor not found' })
    res.json({ ...user.toObject(), tutorProfile: profile })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getMyProfile = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({ user: req.user.id })
    res.json(profile)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createProfile = async (req, res) => {
  try {
    const exists = await TutorProfile.findOne({ user: req.user.id })
    if (exists) return res.status(400).json({ message: 'Profile already exists. Use PUT to update.' })
    const profile = await TutorProfile.create({ user: req.user.id, ...req.body })
    res.status(201).json(profile)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const profile = await TutorProfile.findOneAndUpdate(
      { user: req.user.id }, req.body, { new: true, upsert: true }
    )
    res.json(profile)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}