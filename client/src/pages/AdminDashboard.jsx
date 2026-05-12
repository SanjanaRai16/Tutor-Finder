import { useState, useEffect } from 'react'
import { adminGetStats, adminGetBookings } from '../services/api'

const STATUS_BADGE = {
  pending: 'badge-yellow',
  confirmed: 'badge-green',
  cancelled: 'badge-red'
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({})
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminGetStats(), adminGetBookings()])
      .then(([{ data: s }, { data: b }]) => {
        setStats(s)
        setBookings(b)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <div style={{
          width: 60,
          height: 60,
          border: '6px solid rgba(108,99,255,0.2)',
          borderTop: '6px solid #6c63ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>

      {/* HEADER */}
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
        Admin Dashboard
      </h1>

      <p style={{ color: '#777', marginBottom: 32 }}>
        Platform overview
      </p>

      {/* STATS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
        gap: 20,
        marginBottom: 32
      }}>
        {[
          ['Students', stats.students, '#6c63ff'],
          ['Tutors', stats.tutors, '#00c6ff'],
          ['Total Bookings', stats.bookings, '#10b981'],
          ['Pending Approvals', stats.pendingTutors, '#f59e0b']
        ].map(([label, val, color]) => (
          <div key={label} style={{
            background: 'linear-gradient(145deg,#fff,#f3f4ff)',
            padding: 22,
            borderRadius: 18,
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            border: '1px solid rgba(108,99,255,0.15)'
          }}>
            <div style={{ fontSize: 14, color: '#888' }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color }}>
              {val ?? 0}
            </div>
          </div>
        ))}
      </div>

      {/* BOOKINGS */}
      <h2 style={{
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 16
      }}>
        Recent Bookings
      </h2>

      <div style={{
        background: 'linear-gradient(145deg,#fff,#f8f9ff)',
        borderRadius: 20,
        padding: 20,
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>

          <thead>
            <tr style={{
              background: 'linear-gradient(90deg,#6c63ff,#00c6ff)',
              color: '#fff'
            }}>
              <th style={th}>Student</th>
              <th style={th}>Tutor</th>
              <th style={th}>Slot</th>
              <th style={th}>Status</th>
              <th style={th}>Date</th>
            </tr>
          </thead>

          <tbody>
            {bookings.slice(0, 10).map(b => (
              <tr key={b._id}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={td}>{b.student?.name}</td>
                <td style={td}>{b.tutor?.name}</td>
                <td style={{ ...td, color: '#777' }}>
                  {b.slot?.day} — {b.slot?.time}
                </td>
                <td style={td}>
                  <span className={`badge ${STATUS_BADGE[b.status]}`}>
                    {b.status}
                  </span>
                </td>
                <td style={{ ...td, color: '#777' }}>
                  {new Date(b.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* INTERNAL CSS */}
      <style>{`
        .badge {
          padding: 5px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .badge-yellow {
          background: rgba(255,193,7,0.15);
          color: #f59e0b;
        }

        .badge-green {
          background: rgba(16,185,129,0.15);
          color: #10b981;
        }

        .badge-red {
          background: rgba(239,68,68,0.15);
          color: #ef4444;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  )
}

/* TABLE STYLES */
const th = {
  textAlign: 'left',
  padding: 14,
  fontSize: 14,
  fontWeight: 600
}

const td = {
  padding: 14,
  fontSize: 14
}