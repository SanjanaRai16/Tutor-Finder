import { useState, useEffect } from 'react'
import { getStudentProgress } from '../services/api'

export default function StudentProgress() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getStudentProgress().then(({ data }) => setNotes(data)).finally(() => setLoading(false))
  }, [])

  const subjects = [...new Set(notes.map(n => n.subject))]
  const filtered = filter === 'all' ? notes : notes.filter(n => n.subject === filter)
  const avgPerformance = notes.length
    ? (notes.reduce((s, n) => s + n.performance, 0) / notes.length).toFixed(1)
    : 0

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
  }}>
    My Progress</h1>
      <p className="page-sub fade-up-2">Track your learning journey</p>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 28 }}>
        <div className="stat-card fade-up">
          <div className="stat-label">Total Sessions</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{notes.length}</div>
        </div>
        <div className="stat-card fade-up-2">
          <div className="stat-label">Avg Performance</div>
          <div className="stat-value" style={{ color: 'var(--accent3)' }}>
            {avgPerformance}/5
          </div>
        </div>
        <div className="stat-card fade-up-3">
          <div className="stat-label">Subjects Covered</div>
          <div className="stat-value" style={{ color: 'var(--accent2)' }}>{subjects.length}</div>
        </div>
      </div>

      {/* Filter by subject */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('all')}>All</button>
        {subjects.map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      {loading ? <div className="loader-wrap"><div className="loader" /></div>
        : filtered.length === 0
          ? (
            <div style={{ textAlign: 'center', padding: 80, color: 'var(--muted)' }}>
              <div style={{ fontSize: 48 }}>📚</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 20, marginTop: 16 }}>No progress notes yet</div>
              <p style={{ fontSize: 14, marginTop: 8 }}>Progress notes are added by your tutor after each session</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filtered.map((note, i) => (
                <div key={note._id} className="card fade-up" style={{ borderLeft: `3px solid var(--accent)` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <span className="badge badge-purple" style={{ marginRight: 8 }}>{note.subject}</span>
                      <span style={{ fontSize: 13, color: 'var(--muted)' }}>with {note.tutor?.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="stars" style={{ fontSize: 14 }}>
                        {'★'.repeat(note.performance)}{'☆'.repeat(5 - note.performance)}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                        {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Topics Covered</div>
                    <p style={{ fontSize: 14, lineHeight: 1.6 }}>{note.topicsCovered}</p>
                  </div>
                  {note.homework && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Homework</div>
                      <p style={{ fontSize: 14, color: 'var(--accent3)', lineHeight: 1.6 }}>{note.homework}</p>
                    </div>
                  )}
                  {note.notes && (
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Tutor Notes</div>
                      <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{note.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
      }
    </div>
  )
}