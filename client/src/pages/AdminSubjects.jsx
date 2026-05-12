import { useState, useEffect } from 'react'
import { adminGetSubjects, adminAddSubject, adminDeleteSubject, adminToggleSubject } from '../services/api'

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([])
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    adminGetSubjects().then(({ data }) => setSubjects(data)).finally(() => setLoading(false))
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      const { data } = await adminAddSubject({ name: newName.trim() })
      setSubjects(prev => [...prev, data])
      setNewName('')
      setMsg('Subject added!')
    } catch (err) { setMsg(err.response?.data?.message || 'Error') }
  }

  const handleDelete = async (id) => {
    await adminDeleteSubject(id)
    setSubjects(prev => prev.filter(s => s._id !== id))
  }

  const handleToggle = async (id) => {
    const { data } = await adminToggleSubject(id)
    setSubjects(prev => prev.map(s => s._id === id ? data : s))
  }

  return (
    <div className="page">
      <h1 className="page-title fade-up" style={{
    fontFamily: 'var(--font-head)',
    fontSize: 'clamp(32px,5vw,48px)',
    fontWeight: 900,
    marginBottom: 8,
    lineHeight: 1.2, // ✅ FIX
    display: 'inline-block', // ✅ FIX
    background: 'linear-gradient(90deg, #6c63ff, #00c6ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}>Manage Subjects</h1>
      <p className="page-sub fade-up-2">{subjects.length} subjects in the system</p>

      <div className="card fade-up" style={{ marginBottom: 24, maxWidth: 480 }}>
        <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 16 }}>Add New Subject</h3>
        {msg && <div className="alert alert-success">{msg}</div>}
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10 }}>
          <input className="form-input" value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="e.g. Computer Science" required />
          <button className="btn btn-primary" type="submit">Add</button>
        </form>
      </div>

      {loading ? <div className="loader-wrap"><div className="loader" /></div> : (
        <div className="card fade-up">
          <table>
            <thead><tr><th>Subject</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s._id}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td><span className={`badge ${s.isActive ? 'badge-green' : 'badge-red'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleToggle(s._id)}>
                      {s.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}