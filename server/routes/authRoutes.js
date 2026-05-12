
// import upload from '../utils/multer.js'
// import { register, login } from '../controllers/authController.js'

// const router = express.Router()

// // ✅ ONLY ONE REGISTER ROUTE (with multer)
// router.post('/register', upload.single('profilePic'), register)

// router.post('/login', login)

// export default router

import express from 'express'
import { register, login, logout } from '../controllers/authController.js'
import upload from '../utils/multer.js'
import { protect } from '../middleware/auth.js'
import User from '../models/User.js'

const router = express.Router()

router.post('/register', upload.single('profilePic'), register)
router.post('/login', login)
router.post('/logout', logout)
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: req.body.name, phone: req.body.phone },
      { new: true }
    ).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router

