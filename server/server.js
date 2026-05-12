// import express from 'express'
// import cors from 'cors'
// import dotenv from 'dotenv'
// import connectDB from './config/db.js'
// import authRoutes from './routes/authRoutes.js'
// import tutorRoutes from './routes/tutorRoutes.js'
// import bookingRoutes from './routes/bookingRoutes.js'
// import reviewRoutes from './routes/reviewRoutes.js'
// import adminRoutes from './routes/adminRoutes.js'
// import path from 'path'


// dotenv.config()
// console.log("ENV CHECK:", process.env.MONGO_URI);
// connectDB()

// const app = express()
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
// app.use(express.json())

// app.use('/api/auth',     authRoutes)
// app.use('/api/tutors',   tutorRoutes)
// app.use('/api/bookings', bookingRoutes)
// app.use('/api/reviews',  reviewRoutes)
// app.use('/api/admin',    adminRoutes)
// app.use('/uploads', express.static(path.join('uploads')))
// app.listen(process.env.PORT, () =>
//   console.log(`Server running on port ${process.env.PORT}`)
// )
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import tutorRoutes from './routes/tutorRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import path from 'path'
import cookieParser from 'cookie-parser'   // ✅ ADD THIS
import complaintRoutes from './routes/complaintRoutes.js'
import progressRoutes from './routes/progressRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
dotenv.config()
console.log("ENV CHECK:", process.env.MONGO_URI);
connectDB()

const app = express()

app.use(cors({ 
  origin: ['http://localhost:5173', 'https://tutor-finder-ruddy.vercel.app/'],
  credentials: true   // ✅ REQUIRED for cookies
}))

app.use(express.json())
app.use(cookieParser())   // ✅ ADD THIS (VERY IMPORTANT)

app.use('/api/auth',     authRoutes)
app.use('/api/tutors',   tutorRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/reviews',  reviewRoutes)
app.use('/api/admin',    adminRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/messages',   messageRoutes)
// ❌ OPTIONAL NOW (since using Cloudinary)
// app.use('/uploads', express.static(path.join('uploads')))

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
)