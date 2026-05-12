import { Link } from 'react-router-dom'
export default function TutorCard({ tutor }) {
  const p = tutor.tutorProfile || {}
  return (
    <div className="card fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{
          width: 50, height: 50, borderRadius: '50%', flexShrink: 0, color: '#fff',
          background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 20
        }}>{tutor.name?.[0]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16 }}>{tutor.name}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>{p.subjects?.join(', ')}</div>
          {p.avgRating > 0 && (
            <span className="stars" style={{ fontSize: 12 }}>
              {'★'.repeat(Math.round(p.avgRating))}{'☆'.repeat(5 - Math.round(p.avgRating))}
              <span style={{ color: 'var(--muted)', marginLeft: 4 }}>{Number(p.avgRating).toFixed(1)}</span>
            </span>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 20, color: 'var(--accent3)' }}>₹{p.hourlyRate}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>/hr</div>
        </div>
      </div>
      {p.bio && <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{p.bio?.slice(0, 110)}…</p>}
      <Link to={`/tutors/${tutor._id}`} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>View Profile →</Link>
    </div>
  )
}