import { useState, useEffect } from 'react'
import { adminGetUsers } from '../services/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    adminGetUsers()
      .then(({ data }) => setUsers(data))
      .finally(() => setLoading(false))
  }, [])

  const filtered =
    filter === 'all' ? users : users.filter(u => u.role === filter)

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
        Manage Users
      </h1>

      <p style={{
        color: 'var(--muted)',
        fontSize: 16,
        marginBottom: 24
      }}>
        {users.length} users registered
      </p>

      {/* Filter Buttons */}
      <div style={{
        display: 'flex',
        gap: 10,
        marginBottom: 24,
        flexWrap: 'wrap'
      }}>
        {['all', 'student', 'tutor', 'admin'].map(r => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            style={{
              padding: '8px 18px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'capitalize',
              cursor: 'pointer',
              border: filter === r
                ? 'none'
                : '1px solid var(--border)',
              background: filter === r
                ? 'linear-gradient(90deg, var(--accent), var(--accent2))'
                : 'transparent',
              color: filter === r ? '#fff' : 'var(--muted)',
              transition: '0.2s'
            }}
          >
            {r}
          </button>
        ))}
      </div>

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

        /* Table Card */
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
            minWidth: 600
          }}>
            <thead>
              <tr style={{
                textAlign: 'left',
                borderBottom: '1px solid var(--border)'
              }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Joined</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map(u => (
                <tr key={u._id} style={{
                  borderBottom: '1px solid var(--border)',
                  transition: '0.2s'
                }}>
                  <td style={{ padding: 14, fontWeight: 600 }}>
                    {u.name}
                  </td>

                  <td style={{ padding: 14, color: 'var(--muted)' }}>
                    {u.email}
                  </td>

                  {/* Role Badge */}
                  <td style={{ padding: 14 }}>
                    <span style={{
                      padding: '5px 12px',
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      background:
                        u.role === 'student'
                          ? 'rgba(170,59,255,0.15)'
                          : u.role === 'tutor'
                          ? 'rgba(16,185,129,0.15)'
                          : 'rgba(239,68,68,0.15)',
                      color:
                        u.role === 'student'
                          ? '#aa3bff'
                          : u.role === 'tutor'
                          ? '#10b981'
                          : '#ef4444'
                    }}>
                      {u.role}
                    </span>
                  </td>

                  <td style={{ padding: 14, color: 'var(--muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
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

/* Table header */
const thStyle = {
  padding: 12,
  fontSize: 13,
  color: 'var(--muted)',
  fontWeight: 600
}