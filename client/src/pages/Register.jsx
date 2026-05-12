// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { register } from '../services/api'
// import { useAuth } from '../context/AuthContext'

// export default function Register() {
//   const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', role: 'student' })
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const { loginUser } = useAuth()
//   const navigate = useNavigate()
//   const [file, setFile] = useState(null)

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)
//     try {
//       const { data } = await register(form)
//       loginUser(data)
//       if (data.role === 'tutor') navigate('/tutor/profile/edit')
//       else if (data.role === 'student') navigate('/tutors')
//       else if (data.role === 'admin') navigate('/admin')
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed')
//     } finally { setLoading(false) }
//   }

//   return (
//     <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
//       <div className="card fade-up" style={{ width: '100%', maxWidth: 440 }}>
//         <h1 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 28, marginBottom: 6 }}>Create account</h1>
//         <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>Join TutorFind today</p>
//         {error && <div className="alert alert-error">{error}</div>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label className="form-label">Full Name</label>
//             <input className="form-input" name="name" required value={form.name}
//               onChange={handleChange} placeholder="Ravi Kumar" />
//           </div>
//           <div className="form-group">
//   <label className="form-label">Profile Picture</label>
//   <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
// </div>
//           <div className="form-group">
//             <label className="form-label">Phone</label>
//             <input className="form-input" name="phone" type="tel" required value={form.phone}
//               onChange={handleChange} placeholder="+91 98765 43210" />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Email</label>
//             <input className="form-input" name="email" type="email" required value={form.email}
//               onChange={handleChange} placeholder="you@example.com" />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Password</label>
//             <input className="form-input" name="password" type="password" required minLength={6}
//               value={form.password} onChange={handleChange} placeholder="Min 6 characters" />
//           </div>
//           <div className="form-group">
//             <label className="form-label">I am a…</label>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
//               {['student', 'tutor', 'admin'].map(r => (
//                 <button key={r} type="button" onClick={() => setForm({ ...form, role: r })} style={{
//                   padding: 12,
//                   borderRadius: 10,
//                   border: `1px solid ${form.role === r ? 'var(--accent)' : 'var(--border)'}`,
//                   background: form.role === r ? 'rgba(108,99,255,.1)' : 'var(--bg3)',
//                   color: form.role === r ? 'var(--accent)' : 'var(--muted)',
//                   cursor: 'pointer',
//                   fontFamily: 'var(--font-body)',
//                   fontWeight: 500,
//                   fontSize: 14,
//                   textTransform: 'capitalize'
//                 }}>{r}</button>
//               ))}
//             </div>
//           </div>
//           <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
//             {loading ? 'Creating…' : 'Create account →'}
//           </button>
//         </form>
//         <hr className="divider" />
//         <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)' }}>
//           Have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
//         </p>
//       </div>
//     </div>
//   )
// }
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'student'
  })

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    setFile(selected)

    // preview image
    if (selected) {
      setPreview(URL.createObjectURL(selected))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formData = new FormData()

      // append text fields
      Object.keys(form).forEach(key => {
        formData.append(key, form[key])
      })

      // append file
      if (file) {
        formData.append('profilePic', file)
      }

      const { data } = await register(formData)

      loginUser(data)

      if (data.role === 'tutor') navigate('/tutor/profile/edit')
      else if (data.role === 'admin') navigate('/admin')
      else navigate('/tutors')

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }}>
      <div className="card fade-up" style={{ width: '100%', maxWidth: 450, padding: 24 }}>
        
        <h1 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 28 }}>
          Create account
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
          Join TutorFind today
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Ravi Kumar"
              style={inputStyle}
            />
          </div>

          {/* Profile Image */}
          <div className="form-group">
            <label className="form-label">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginBottom: 10 }}
            />

            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--accent)'
                }}
              />
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              className="form-input"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="+91 9876543210"
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Min 6 characters"
              style={inputStyle}
            />
          </div>

          {/* Role */}
          <div className="form-group">
            <label className="form-label">I am a…</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {['student', 'tutor', 'admin'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: `1px solid ${form.role === r ? 'var(--accent)' : 'var(--border)'}`,
                    background: form.role === r ? 'rgba(108,99,255,.1)' : 'var(--bg3)',
                    color: form.role === r ? 'var(--accent)' : 'var(--muted)',
                    cursor: 'pointer',
                    fontWeight: 500,
                    textTransform: 'capitalize'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 10 }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create account →'}
          </button>

        </form>

        <hr className="divider" />

        <p style={{ textAlign: 'center', fontSize: 14 }}>
          Have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

// reusable input style
const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid var(--border)',
  fontSize: 14,
  marginTop: 6,
  boxSizing: 'border-box'
}