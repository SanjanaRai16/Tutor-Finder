import { useState, useEffect } from 'react'
import { adminGetActivity } from '../services/api'

export default function AdminActivity() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetActivity().then(({ data }) => setData(data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>

  const maxBookings = Math.max(...(data?.bookingsByDay?.map(d => d.count) || [1]))

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
  }}>Activity Reports</h1>
      <p className="page-sub fade-up-2">Last 7 days overview</p>

      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Bookings per day */}
        <div className="card fade-up">
          <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 20 }}>Bookings per Day</h3>
          {data?.bookingsByDay?.length === 0
            ? <p style={{ color: 'var(--muted)' }}>No bookings in last 7 days</p>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data?.bookingsByDay?.map(d => (
                <div key={d._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: 'var(--muted)' }}>{d._id}</span>
                    <span style={{ fontWeight: 600 }}>{d.count}</span>
                  </div>
                  <div style={{ background: 'var(--bg3)', borderRadius: 4, height: 8 }}>
                    <div style={{ background: 'var(--accent)', borderRadius: 4, height: 8, width: `${(d.count / maxBookings) * 100}%`, transition: 'width 0.5s' }} />
                  </div>
                </div>
              ))}
            </div>
          }
        </div>

        {/* Bookings by status */}
        <div className="card fade-up-2">
          <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 20 }}>Bookings by Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {data?.bookingsByStatus?.map(s => (
              <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ textTransform: 'capitalize', color: 'var(--muted)' }}>{s._id}</span>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 24,
                  color: s._id === 'confirmed' ? 'var(--accent3)' : s._id === 'cancelled' ? '#ff4757' : 'var(--accent)' }}>
                  {s.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New users per day */}
      <div className="card fade-up-3">
        <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 20 }}>New Users per Day</h3>
        {data?.usersByDay?.length === 0
          ? <p style={{ color: 'var(--muted)' }}>No new users in last 7 days</p>
          : <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {data?.usersByDay?.map(d => (
              <div key={d._id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 20px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 28, color: 'var(--accent2)' }}>{d.count}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{d._id}</div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  )
}