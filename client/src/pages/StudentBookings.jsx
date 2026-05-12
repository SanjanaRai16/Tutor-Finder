import { useState, useEffect } from 'react'
import { getMyBookings } from '../services/api'

export default function StudentBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyBookings()
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
<h1 style={{
        fontSize: 'clamp(32px,5vw,48px)',
        fontWeight: 900,
        lineHeight: 1.2,
        display: 'inline-block',
        marginBottom: 6,
        background: 'linear-gradient(90deg, #6c63ff, #00c6ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        My Bookings
      </h1>

      <p style={{
        color: 'var(--muted)',
        fontSize: 16,
        marginBottom: 28
      }}>
        {bookings.length} total bookings
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
      ) : bookings.length === 0 ? (

        /* Empty State */
        <div style={{
          textAlign: 'center',
          padding: 80,
          color: 'var(--muted)'
        }}>
          <div style={{ fontSize: 50 }}>📚</div>
          <div style={{
            marginTop: 12,
            fontSize: 18,
            fontWeight: 600
          }}>
            No bookings yet
          </div>
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
                <th style={thStyle}>Tutor</th>
                <th style={thStyle}>Slot</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map(b => (
                <tr key={b._id} style={{
                  borderBottom: '1px solid var(--border)'
                }}>
                  <td style={{ padding: 14, fontWeight: 600 }}>
                    {b.tutor?.name}
                  </td>

                  <td style={{ padding: 14, color: 'var(--muted)' }}>
                    {b.slot?.day} — {b.slot?.time}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: 14 }}>
                    <span style={{
                      padding: '5px 12px',
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      background:
                        b.status === 'pending'
                          ? 'rgba(255,193,7,0.15)'
                          : b.status === 'confirmed'
                          ? 'rgba(16,185,129,0.15)'
                          : 'rgba(239,68,68,0.15)',
                      color:
                        b.status === 'pending'
                          ? '#f59e0b'
                          : b.status === 'confirmed'
                          ? '#10b981'
                          : '#ef4444'
                    }}>
                      {b.status}
                    </span>
                  </td>

                  <td style={{ padding: 14, color: 'var(--muted)' }}>
                    {new Date(b.createdAt).toLocaleDateString()}
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