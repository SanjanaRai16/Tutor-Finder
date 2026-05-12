import { useState, useEffect } from 'react'
import { adminGetComplaints, adminResolveComplaint } from '../services/api'

const STATUS_BADGE = { open: 'badge-yellow', resolved: 'badge-green', dismissed: 'badge-red' }

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')

  useEffect(() => {
    adminGetComplaints().then(({ data }) => setComplaints(data)).finally(() => setLoading(false))
  }, [])

  const handleResolve = async (id, status) => {
    const { data } = await adminResolveComplaint(id, { status, adminNote: note })
    setComplaints(prev => prev.map(c => c._id === id ? data : c))
    setSelected(null); setNote('')
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
  }}>Complaints</h1>
      <p className="page-sub fade-up-2">{complaints.filter(c => c.status === 'open').length} open complaints</p>

      {loading ? <div className="loader-wrap"><div className="loader" /></div> : (
        complaints.length === 0
          ? <div style={{ textAlign: 'center', padding: 80, color: 'var(--muted)' }}>No complaints yet.</div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {complaints.map(c => (
              <div key={c._id} className="card fade-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 17 }}>{c.subject}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                      By: <strong>{c.raisedBy?.name}</strong> ({c.raisedBy?.role})
                      {c.against && <> · Against: <strong>{c.against?.name}</strong></>}
                    </div>
                  </div>
                  <span className={`badge ${STATUS_BADGE[c.status]}`}>{c.status}</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>{c.message}</p>
                {c.adminNote && <p style={{ fontSize: 13, color: 'var(--accent3)', marginBottom: 12 }}>Admin note: {c.adminNote}</p>}
                {c.status === 'open' && (
                  <>
                    {selected === c._id ? (
                      <div>
                        <textarea className="form-textarea" value={note} onChange={e => setNote(e.target.value)}
                          placeholder="Add a note (optional)…" style={{ marginBottom: 10 }} />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-success btn-sm" onClick={() => handleResolve(c._id, 'resolved')}>Mark Resolved</button>
                          <button className="btn btn-danger btn-sm"  onClick={() => handleResolve(c._id, 'dismissed')}>Dismiss</button>
                          <button className="btn btn-outline btn-sm" onClick={() => setSelected(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button className="btn btn-outline btn-sm" onClick={() => setSelected(c._id)}>Take Action</button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
      )}
    </div>
  )
}