// import axios from 'axios'

// const api = axios.create({ baseURL: '/api' })

// api.interceptors.request.use(config => {
//   const user = JSON.parse(localStorage.getItem('user') || 'null')
//   if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
//   return config
// })

// // ✅ FIXED (no headers here)
// export const register = (d) => api.post('/auth/register', d)

// export const login             = (d)    => api.post('/auth/login', d)
// export const getTutors         = (p)    => api.get('/tutors', { params: p })
// export const getTutorById      = (id)   => api.get(`/tutors/${id}`)
// export const getMyProfile      = ()     => api.get('/tutors/my-profile')
// export const createProfile     = (d)    => api.post('/tutors/profile', d)
// export const updateProfile     = (d)    => api.put('/tutors/profile', d)
// export const createBooking     = (d)    => api.post('/bookings', d)
// export const getMyBookings     = ()     => api.get('/bookings/my')
// export const updateBooking     = (id,d) => api.patch(`/bookings/${id}`, d)
// export const createReview      = (d)    => api.post('/reviews', d)
// export const getTutorReviews   = (id)   => api.get(`/reviews/tutor/${id}`)
// export const adminGetStats     = ()     => api.get('/admin/stats')
// export const adminGetTutors    = ()     => api.get('/admin/tutors')
// export const adminGetUsers     = ()     => api.get('/admin/users')
// export const adminGetBookings  = ()     => api.get('/admin/bookings')
// export const adminApproveTutor = (id)   => api.patch(`/admin/tutors/${id}/approve`)
// export const adminRejectTutor  = (id)   => api.patch(`/admin/tutors/${id}/reject`)

// export default api
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

// api.interceptors.request.use(config => {
//   const user = JSON.parse(localStorage.getItem('user') || 'null')
//   if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
//   return config
// })

export const register          = (d)    => api.post('/auth/register', d)
export const login             = (d)    => api.post('/auth/login', d)
export const getTutors         = (p)    => api.get('/tutors', { params: p })
export const getTutorById      = (id)   => api.get(`/tutors/${id}`)
export const getMyProfile      = ()     => api.get('/tutors/my-profile')
export const createProfile     = (d)    => api.post('/tutors/profile', d)
export const updateProfile     = (d)    => api.put('/tutors/profile', d)
export const createBooking     = (d)    => api.post('/bookings', d)
export const getMyBookings     = ()     => api.get('/bookings/my')
export const updateBooking     = (id,d) => api.patch(`/bookings/${id}`, d)
export const createReview      = (d)    => api.post('/reviews', d)
export const getTutorReviews   = (id)   => api.get(`/reviews/tutor/${id}`)

// Admin
export const adminGetStats       = ()     => api.get('/admin/stats')
export const adminGetTutors      = ()     => api.get('/admin/tutors')
export const adminGetUsers       = ()     => api.get('/admin/users')
export const adminGetBookings    = ()     => api.get('/admin/bookings')
export const adminApproveTutor   = (id)   => api.patch(`/admin/tutors/${id}/approve`)
export const adminRejectTutor    = (id)   => api.patch(`/admin/tutors/${id}/reject`)
export const adminGetActivity    = ()     => api.get('/admin/activity')
export const adminGetComplaints  = ()     => api.get('/admin/complaints')
export const adminResolveComplaint = (id,d) => api.patch(`/admin/complaints/${id}`, d)
export const adminGetSubjects    = ()     => api.get('/admin/subjects')
export const adminAddSubject     = (d)    => api.post('/admin/subjects', d)
export const adminDeleteSubject  = (id)   => api.delete(`/admin/subjects/${id}`)
export const adminToggleSubject  = (id)   => api.patch(`/admin/subjects/${id}/toggle`)

// Complaints
export const createComplaint    = (d)    => api.post('/complaints', d)
export const getMyComplaints    = ()     => api.get('/complaints/my')

// Student profile
export const getStudentProfile  = ()     => api.get('/auth/profile')
export const updateStudentProfile = (d)  => api.put('/auth/profile', d)
// Progress
export const createProgressNote   = (d)  => api.post('/progress', d)
export const getStudentProgress   = ()   => api.get('/progress/student')
export const getTutorProgressNotes= ()   => api.get('/progress/tutor')
export const sendMessage        = (d)    => api.post('/messages', d)
export const getConversation    = (id)   => api.get(`/messages/${id}`)
export const getMyConversations = ()     => api.get('/messages/conversations')
export default api