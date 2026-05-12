import jwt from 'jsonwebtoken'

// PROTECT (COOKIE BASED)
export const protect = (req, res, next) => {
  try {
    const token = req.cookies.token   // 🍪 GET FROM COOKIE

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}


// ADMIN ONLY
export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' })
  }
  next()
}


// TUTOR ONLY
export const tutorOnly = (req, res, next) => {
  if (req.user.role !== 'tutor') {
    return res.status(403).json({ message: 'Tutor access only' })
  }
  next()
}