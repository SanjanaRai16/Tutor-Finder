import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import TutorList from './pages/TutorList'
import TutorProfile from './pages/TutorProfile'
import StudentBookings from './pages/StudentBookings'
import TutorDashboard from './pages/TutorDashboard'
import TutorEditProfile from './pages/TutorEditProfile'
import AdminDashboard from './pages/AdminDashboard'
import AdminTutors from './pages/AdminTutors'
import AdminUsers from './pages/AdminUsers'
import AdminSubjects from './pages/AdminSubjects'
import AdminActivity from './pages/AdminActivity'
import AdminComplaints from './pages/AdminComplaints'
import StudentProfile from './pages/StudentProfile'
import RaiseComplaint from './pages/RaiseComplaint'
import TutorMatchQuiz from './pages/TutorMatchQuiz'
import StudentProgress from './pages/StudentProgress'
import AddProgressNote from './pages/AddProgressNote'
import Messages from './pages/Messages'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tutors" element={<TutorList />} />
          <Route path="/tutors/:id" element={<TutorProfile />} />
          <Route path="/match" element={<TutorMatchQuiz />} />

          {/* Messages — any logged in user */}
          <Route element={<PrivateRoute />}>
            <Route path="/messages" element={<Messages />} />
          </Route>

          {/* Student */}
          <Route element={<PrivateRoute role="student" />}>
            <Route path="/student/bookings"  element={<StudentBookings />} />
            <Route path="/student/progress"  element={<StudentProgress />} />
            <Route path="/student/profile"   element={<StudentProfile />} />
            <Route path="/student/complaint" element={<RaiseComplaint />} />
          </Route>

          {/* Tutor */}
          <Route element={<PrivateRoute role="tutor" />}>
            <Route path="/tutor/dashboard"    element={<TutorDashboard />} />
            <Route path="/tutor/profile/edit" element={<TutorEditProfile />} />
            <Route path="/tutor/progress"     element={<AddProgressNote />} />
            <Route path="/tutor/complaint"    element={<RaiseComplaint />} />
          </Route>

          {/* Admin */}
          <Route element={<PrivateRoute role="admin" />}>
            <Route path="/admin"             element={<AdminDashboard />} />
            <Route path="/admin/tutors"      element={<AdminTutors />} />
            <Route path="/admin/users"       element={<AdminUsers />} />
            <Route path="/admin/subjects"    element={<AdminSubjects />} />
            <Route path="/admin/activity"    element={<AdminActivity />} />
            <Route path="/admin/complaints"  element={<AdminComplaints />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}