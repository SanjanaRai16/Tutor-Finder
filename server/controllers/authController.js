// import User from '../models/User.js'
// import jwt from 'jsonwebtoken'
// import sendEmail from '../utils/sendEmail.js'

// const genToken = (user) => jwt.sign(
//   { id: user._id, role: user.role },
//   process.env.JWT_SECRET,
//   { expiresIn: '7d' }
// )

// export const register = async (req, res) => {
//   try {
//     console.log('REGISTER BODY:', req.body)
//     const { name, phone, email, password, role } = req.body

//     if (await User.findOne({ email })) 
//       return res.status(400).json({ message: 'Email already registered' })
//     // ✅ HANDLE IMAGE
//     let profilePic = ''
//     if (req.file) {
//       profilePic = req.file.path.replace(/\\/g, '/')
//     }

//     const user = await User.create({ name, phone, email, password, role, profilePic })

//     // Send welcome email
//    await sendEmail(
//   email,
//   "Welcome to Tutor Finder 🎉",
//   `
//   <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
//     <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
//       <h1 style="color: #4CAF50; text-align: center;">Welcome to Tutor Finder!</h1>
//       <p style="font-size: 16px; color: #333;">Hello <strong>${name}</strong>,</p>
//       <p style="font-size: 16px; color: #333;">
//         ${role === 'tutor' 
//           ? "We're thrilled to have you join as a <strong>Tutor</strong>. Start sharing your knowledge and helping students excel!" 
//           : "We're excited to welcome you as a <strong>Student</strong>. Find the best tutors and achieve your learning goals!"}
//       </p>
      
//       <p style="font-size: 12px; color: #777; text-align: center; margin-top: 20px;">
//         © 2026 Tutor Finder. All rights reserved.
//       </p>
//     </div>
//   </div>
//   `
// );
//     // Send response once
//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//        profilePic:user.profilePic, 
//       token: genToken(user),
//       message: "User registered & email sent ✅"
//     });
// console.log("FILE:", req.file)
//   } catch (err) {
//     console.error('REGISTER ERROR:', err.message)
//     res.status(500).json({ message: err.message })
//   }
// }

// export const login = async (req, res) => {
//   try {
//     console.log('LOGIN BODY:', req.body)
//     const { email, password } = req.body
//     const user = await User.findOne({ email })
//     if (!user || !(await user.matchPassword(password)))
//       return res.status(400).json({ message: 'Invalid credentials' })
//     res.json({
//       _id: user._id, name: user.name,
//       email: user.email, role: user.role,
//       token: genToken(user)
//     })
//   } catch (err) {
//     console.error('LOGIN ERROR:', err.message)
//     res.status(500).json({ message: err.message })
//   }
// }

import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import sendEmail from '../utils/sendEmail.js'

const genToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // ✅ Cloudinary image
    let profilePic = ''
    if (req.file) {
      profilePic = req.file.path   // ✅ Cloudinary URL
    }

    const user = await User.create({
      name,
      phone,
      email,
      password,
      role,
      profilePic
    })

    // ✅ Send Email
    await sendEmail(
      email,
      "Welcome to Tutor Finder 🎉",
      `<h2>Hello ${name}</h2><p>Welcome to Tutor Finder!</p>`
    )

    // 🍪 SET COOKIE
    const token = genToken(user)
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
      message: "User registered & logged in ✅"
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = genToken(user)

    // 🍪 SET COOKIE
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "Login successful"
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// ✅ LOGOUT
export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  })

  res.json({ message: "Logged out successfully" })
}