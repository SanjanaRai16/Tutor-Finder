import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logoutUser } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

 const links = !user ? [] :
  user.role === 'student' ? [
    { to: '/tutors',            label: 'Find Tutors' },
    { to: '/match',             label: '✦ Find My Match' },
    { to: '/student/bookings',  label: 'My Bookings' },
    { to: '/student/progress',  label: 'My Progress' },
    { to: '/student/profile',   label: 'Profile' },
    { to: '/student/complaint', label: 'Complaints' },
    { to: '/messages',           label: '💬 Messages' }
  ] : user.role === 'tutor' ? [
    { to: '/tutor/dashboard',    label: 'Dashboard' },
    { to: '/tutor/profile/edit', label: 'My Profile' },
    { to: '/tutor/progress',     label: 'Add Progress Note' },
    { to: '/tutor/complaint',    label: 'Complaints' },
      { to: '/messages',           label: '💬 Messages' }
  ] : [
    { to: '/admin',              label: 'Dashboard' },
    { to: '/admin/tutors',       label: 'Tutors' },
    { to: '/admin/users',        label: 'Users' },
    { to: '/admin/subjects',     label: 'Subjects' },
    { to: '/admin/activity',     label: 'Activity' },
    { to: '/admin/complaints',   label: 'Complaints' },
  ]

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(16px)',
      background: 'linear-gradient(90deg, rgba(15,15,25,0.85), rgba(30,30,60,0.85))',
      borderBottom: '1px solid rgba(108,99,255,0.25)',
      padding: '0 24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>

        {/* Logo */}
        <Link to="/" style={{
          fontFamily: 'var(--font-head)',
          fontWeight: 900,
          fontSize: 22,
          textDecoration: 'none',
          background: 'linear-gradient(90deg, #6c63ff, #00c6ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Tutor
          <span style={{
            background: 'linear-gradient(90deg, #ff7a18, #ff3d77)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Find
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="desktop-links" style={{ display: 'flex', gap: 14 }}>
          {!user && <NavLink to="/tutors" style={linkStyle}>Find Tutors</NavLink>}
          {links.map(l => (
            <NavLink key={l.to} to={l.to} style={linkStyle}>{l.label}</NavLink>
          ))}
        </div>

        {/* Auth Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <span style={{
                fontSize: 13,
                color: '#aaa',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                {user.name}
                <span style={{
                  padding: '3px 8px',
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #6c63ff, #00c6ff)',
                  color: '#fff',
                  textTransform: 'uppercase'
                }}>
                  {user.role}
                </span>
              </span>

              <button onClick={logoutUser} style={logoutButtonStyle}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={loginButtonStyle}>Login</Link>
              <Link to="/register" style={signupButtonStyle}>Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={hamburgerStyle}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: 16,
          background: 'linear-gradient(180deg, rgba(20,20,40,0.95), rgba(30,30,60,0.95))',
          borderTop: '1px solid rgba(108,99,255,0.25)'
        }}>
          {!user && (
            <NavLink to="/tutors" style={linkStyle} onClick={() => setMenuOpen(false)}>
              Find Tutors
            </NavLink>
          )}

          {links.map(l => (
            <NavLink key={l.to} to={l.to} style={linkStyle} onClick={() => setMenuOpen(false)}>
              {l.label}
            </NavLink>
          ))}

          {user && (
            <button
              onClick={() => {
                logoutUser()
                setMenuOpen(false)
              }}
              style={logoutButtonStyle}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

/* ================= STYLES ================= */

const linkStyle = ({ isActive }) => ({
  padding: '6px 14px',
  borderRadius: 10,
  fontSize: 14,
  textDecoration: 'none',
  color: isActive ? '#fff' : '#bbb',
  background: isActive
    ? 'linear-gradient(90deg, #6c63ff, #00c6ff)'
    : 'transparent',
  transition: 'all 0.3s ease'
})

const logoutButtonStyle = {
  padding: '6px 14px',
  borderRadius: 10,
  fontSize: 14,
  border: '1px solid transparent',
  background:
    'linear-gradient(#111, #111) padding-box, linear-gradient(90deg, #6c63ff, #00c6ff) border-box',
  color: '#6c63ff',
  cursor: 'pointer'
}

const loginButtonStyle = {
  padding: '6px 14px',
  borderRadius: 10,
  fontSize: 14,
  background:
    'linear-gradient(90deg, rgba(108,99,255,0.1), rgba(0,198,255,0.1))',
  border: '1px solid rgba(108,99,255,0.3)',
  color: '#ccc',
  textDecoration: 'none'
}

const signupButtonStyle = {
  padding: '6px 16px',
  borderRadius: 10,
  fontSize: 14,
  border: 'none',
  background: 'linear-gradient(90deg, #6c63ff, #00c6ff)',
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 600
}

const hamburgerStyle = {
  display: 'none',
  fontSize: 24,
  background: 'none',
  border: 'none',
  color: '#ccc',
  cursor: 'pointer'
}