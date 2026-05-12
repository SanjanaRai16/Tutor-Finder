import { useState, useEffect } from 'react'
import { adminGetTutors, adminApproveTutor, adminRejectTutor } from '../services/api'

export default function AdminTutors() {
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetTutors()
      .then(({ data }) => setTutors(data))
      .finally(() => setLoading(false))
  }, [])

  const handle = async (id, action) => {
    const { data } = await (action === 'approve'
      ? adminApproveTutor(id)
      : adminRejectTutor(id))

    setTutors(prev =>
      prev.map(t =>
        t.user._id === id ? { ...t, isApproved: data.isApproved } : t
      )
    )
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>

      {/* Header */}
      <h1 style={{
        fontFamily: 'var(--font-head)',
        fontSize: 'clamp(32px,5vw,48px)',
        fontWeight: 800,
        marginBottom: 8
      }} style={{
    fontFamily: 'var(--font-head)',
    fontSize: 'clamp(32px,5vw,48px)',
    fontWeight: 900,
    marginBottom: 8,
    lineHeight: 1.2, // ✅ FIX
    display: 'inline-block', // ✅ FIX
    background: 'linear-gradient(90deg, #6c63ff, #00c6ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}>
        Manage Tutors
      </h1>

      <p style={{
        color: 'var(--muted)',
        fontSize: 16,
        marginBottom: 28
      }}>
        {tutors.length} tutor profiles registered
      </p>

      {/* Loader */}
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: 80
        }}>
          <div style={{
            width: 60,
            height: 60,
            border: '6px solid var(--accent)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      ) : (

        <div style={{
          background: 'linear-gradient(135deg, #ffffff, #f8f9ff)',
          borderRadius: 20,
          padding: 24,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          overflowX: 'auto'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: 700
          }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Subjects</th>
                <th style={thStyle}>Rate ₹/hr</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tutors.map(t => (
                <tr key={t._id} style={{
                  borderBottom: '1px solid var(--border)',
                  transition: '0.2s'
                }}>
                  <td style={{ padding: 14, fontWeight: 600 }}>
                    {t.user?.name}
                  </td>

                  <td style={{ padding: 14, color: 'var(--muted)' }}>
                    {t.user?.email}
                  </td>

                  <td style={{ padding: 14, color: 'var(--muted)' }}>
                    {t.subjects?.join(', ') || '—'}
                  </td>

                  <td style={{ padding: 14 }}>
                    {t.hourlyRate ? `₹${t.hourlyRate}` : '—'}
                  </td>

                  {/* Status */}
                  <td style={{ padding: 14 }}>
                    <span style={{
                      padding: '5px 10px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      background: t.isApproved
                        ? 'rgba(16,185,129,0.15)'
                        : 'rgba(255,193,7,0.15)',
                      color: t.isApproved ? '#10b981' : '#f59e0b'
                    }}>
                      {t.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{
                    padding: 14,
                    display: 'flex',
                    gap: 10
                  }}>
                    {!t.isApproved ? (
                      <button
                        onClick={() => handle(t.user._id, 'approve')}
                        style={successBtn}
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handle(t.user._id, 'reject')}
                        style={dangerBtn}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Loader Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/* Table header style */
const thStyle = {
  padding: 12,
  fontSize: 13,
  color: 'var(--muted)',
  fontWeight: 600
}

/* Buttons */
const successBtn = {
  padding: '6px 14px',
  borderRadius: 10,
  border: 'none',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
  color: '#fff',
  background: 'linear-gradient(90deg, #10b981, #34d399)',
  transition: '0.2s'
}

const dangerBtn = {
  padding: '6px 14px',
  borderRadius: 10,
  border: 'none',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
  color: '#fff',
  background: 'linear-gradient(90deg, #ef4444, #ff6b6b)',
  transition: '0.2s'
}