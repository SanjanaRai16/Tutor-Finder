import { useState, useEffect } from 'react'
import { getTutors } from '../services/api'
import TutorCard from '../components/TutorCard'

const SUBJECTS = ['Mathematics','Physics','Chemistry','Biology','English','Hindi','History','Computer Science','Economics']
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

export default function TutorList() {
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ subject: '', minRate: '', maxRate: '', search: '', day: '' })

  const fetch = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.subject) params.subject = filters.subject
      if (filters.minRate) params.minRate  = filters.minRate
      if (filters.maxRate) params.maxRate  = filters.maxRate
      if (filters.search)  params.search   = filters.search
      if (filters.day) params.day = filters.day
      const { data } = await getTutors(params)
      setTutors(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  return (
    <div className="page" style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
     <h1
  className="page-title fade-up"
  style={{
    fontFamily: 'var(--font-head)',
    fontSize: 'clamp(32px,5vw,48px)',
    fontWeight: 900,
    marginBottom: 8,
    lineHeight: 1.2, // ✅ FIX
    display: 'inline-block', // ✅ FIX

    background: 'linear-gradient(90deg, #6c63ff, #00c6ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}
>
  Find Your Perfect Tutor
</h1>
      <p className="page-sub fade-up-2" style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 32 }}>
        {tutors.length} verified tutor{tutors.length !== 1 ? 's' : ''} available
      </p>

      {/* Filters */}
      <div className="card fade-up-2" style={{ marginBottom: 28, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
  <div className="form-group" style={{ marginBottom: 0, flex: '2 1 160px' }}>
    <label className="form-label">Search name</label>
    <input className="form-input" placeholder="Search…" value={filters.search}
      onChange={e => setFilters({ ...filters, search: e.target.value })} />
  </div>
  <div className="form-group" style={{ marginBottom: 0, flex: '1 1 130px' }}>
    <label className="form-label">Subject</label>
    <select className="form-select" value={filters.subject} onChange={e => setFilters({ ...filters, subject: e.target.value })}>
      <option value="">All</option>
      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
    </select>
  </div>
  <div className="form-group" style={{ marginBottom: 0, flex: '1 1 120px' }}>
    <label className="form-label">Available Day</label>
    <select className="form-select" value={filters.day} onChange={e => setFilters({ ...filters, day: e.target.value })}>
      <option value="">Any day</option>
      {DAYS.map(d => <option key={d}>{d}</option>)}
    </select>
  </div>
  <div className="form-group" style={{ marginBottom: 0, flex: '1 1 100px' }}>
    <label className="form-label">Min ₹/hr</label>
    <input className="form-input" type="number" placeholder="0" value={filters.minRate}
      onChange={e => setFilters({ ...filters, minRate: e.target.value })} />
  </div>
  <div className="form-group" style={{ marginBottom: 0, flex: '1 1 100px' }}>
    <label className="form-label">Max ₹/hr</label>
    <input className="form-input" type="number" placeholder="5000" value={filters.maxRate}
      onChange={e => setFilters({ ...filters, maxRate: e.target.value })} />
  </div>
  <button className="btn btn-primary" onClick={fetch}>Search</button>
</div>

      {/* Content */}
      {loading ? (
        <div className="loader-wrap" style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <div className="loader" style={{
            display: 'inline-block', width: 64, height: 64, border: '6px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      ) : tutors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--muted)' }}>
          <div style={{ fontSize: 48 }}>🔍</div>
          <div style={{ marginTop: 16, fontFamily: 'var(--font-head)', fontSize: 20 }}>No tutors found</div>
        </div>
      ) : (
        <div className="grid-3" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
          gap: 20
        }}>
          {tutors.map(t => <TutorCard key={t._id} tutor={t} />)}
        </div>
      )}

      {/* Loader keyframes */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}