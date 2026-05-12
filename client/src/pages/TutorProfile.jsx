import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getTutorById, getTutorReviews, createBooking, createReview } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { sendMessage } from '../services/api'
export default function TutorProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [tutor, setTutor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookMsg, setBookMsg] = useState('')
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviewMsg, setReviewMsg] = useState('')
const [contactMsg, setContactMsg] = useState('')
const [contactSent, setContactSent] = useState(false)
const navigate = useNavigate()
  useEffect(() => {
    Promise.all([getTutorById(id), getTutorReviews(id)])
      .then(([{ data: t }, { data: r }]) => {
        setTutor(t)
        setReviews(r)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = async () => {
    if (!selectedSlot) return
    try {
      await createBooking({ tutorId: id, slot: selectedSlot })
      setBookMsg('Booking request sent!')
      setSelectedSlot(null)
    } catch (e) {
      setBookMsg(e.response?.data?.message || 'Booking failed')
    }
  }
  const handleTrialBook = async () => {
  if (!selectedSlot) return
  try {
    await createBooking({ tutorId: id, slot: selectedSlot, isTrial: true })
    setBookMsg('Free trial session requested!')
    setSelectedSlot(null)
  } catch (e) {
    setBookMsg(e.response?.data?.message || 'Booking failed')
  }
}

  const handleReview = async (e) => {
    e.preventDefault()
    try {
      const { data } = await createReview({ tutorId: id, ...reviewForm })
      setReviews(prev => [data, ...prev])
      setReviewMsg('Review submitted!')
      setReviewForm({ rating: 5, comment: '' })
    } catch (e) {
      setReviewMsg(e.response?.data?.message || 'Failed')
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <div style={loader}></div>
    </div>
  )

  if (!tutor) return <div style={{ padding: 40 }}>Tutor not found.</div>

  const p = tutor.tutorProfile || {}

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 24
      }}>

        {/* LEFT SIDE */}
        <div>

          {/* HEADER */}
          <div style={cardFlex}>
          <img
  src={
    tutor.profilePic ||
    `https://ui-avatars.com/api/?name=${tutor.name}&background=6c63ff&color=fff`
  }
  alt="profile"
  style={avatar}
/>

            <div style={{ flex: 1 }}>
              <h1 style={title}>{tutor.name}</h1>

              <div style={subText}>
                {p.subjects?.join(' · ')}
              </div>

              {p.avgRating > 0 && (
                <div style={stars}>
                  {'★'.repeat(Math.round(p.avgRating))}
                  <span style={{ color: '#777' }}>
                    {' '} {Number(p.avgRating).toFixed(1)} ({reviews.length})
                  </span>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={price}>₹{p.hourlyRate}</div>
              <div style={{ fontSize: 12, color: '#777' }}>per hour</div>
            </div>
          </div>

          {/* ABOUT */}
          {p.bio && (
            <div style={card}>
              <h3 style={sectionTitle}>About</h3>
              <p style={subText}>{p.bio}</p>
            </div>
          )}

          {/* REVIEWS */}
          <div style={card}>
            <h3 style={sectionTitle}>Reviews ({reviews.length})</h3>

            {reviews.length === 0 ? (
              <p style={subText}>No reviews yet.</p>
            ) : (
              reviews.map(r => (
                <div key={r._id} style={reviewItem}>
                  <div style={reviewHeader}>
                    <b>{r.student?.name}</b>
                    <span>{'★'.repeat(r.rating)}</span>
                  </div>
                  <p style={subText}>{r.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* ADD REVIEW */}
          {user?.role === 'student' && (
            <div style={card}>
              <h3 style={sectionTitle}>Leave a Review</h3>

              {reviewMsg && <p style={{ color: '#10b981' }}>{reviewMsg}</p>}

              <form onSubmit={handleReview}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button"
                      onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                      style={{
                        ...starBtn,
                        background: reviewForm.rating >= n ? '#ffd600' : '#eee'
                      }}
                    >★</button>
                  ))}
                </div>

                <textarea
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Share your experience…"
                  required
                  style={textarea}
                />

                <button style={btnPrimary}>Submit Review</button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT SIDE (BOOKING) */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={card}>
            <h3 style={sectionTitle}>Book a Session</h3>

            {bookMsg && <p style={{ color: '#6c63ff' }}>{bookMsg}</p>}

            {p.availableSlots?.length ? (
              <>
                {p.availableSlots.map((slot, i) => (
                  <button key={i}
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      ...slotBtn,
                      background: selectedSlot === slot ? '#6c63ff' : '#f5f5f5',
                      color: selectedSlot === slot ? '#fff' : '#333'
                    }}
                  >
                    {slot.day} — {slot.time}
                  </button>
                ))}

            {user?.role === 'student' ? (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <button className="btn btn-primary"
      style={{ width: '100%', justifyContent: 'center' }}
      onClick={handleBook} disabled={!selectedSlot}>
      Confirm Booking (60 min)
    </button>
    <button className="btn btn-outline"
      style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--accent3)', color: 'var(--accent3)' }}
      onClick={() => handleTrialBook()} disabled={!selectedSlot}>
      ✦ Book Free Trial (15 min)
    </button>
  </div>
) : !user && (
  <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
    <a href="/login" style={{ color: 'var(--accent)' }}>Login</a> as a student to book
  </p>
)}
              </>
            ) : (
              <p style={subText}>No available slots.</p>
            )}
          </div>
        </div>
{/* Contact card */}
{user && user.role === 'student' && (
  <div className="card fade-up-2" style={{ marginTop: 16 }}>
    <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 4 }}>Contact Tutor</h3>
    <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>Send a message before booking</p>
    {contactSent
      ? <div className="alert alert-success">Message sent! <button className="btn btn-outline btn-sm" style={{ marginLeft: 8 }} onClick={() => navigate('/messages')}>View Messages</button></div>
      : (
        <>
          <textarea className="form-textarea" value={contactMsg}
            onChange={e => setContactMsg(e.target.value)}
            placeholder="Hi, I need help with…" style={{ minHeight: 80, marginBottom: 10 }} />
          <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}
            onClick={async () => {
              if (!contactMsg.trim()) return
              try {
                await sendMessage({ receiverId: id, message: contactMsg })
                setContactSent(true)
              } catch (e) { console.error(e) }
            }}>
            Send Message
          </button>
        </>
      )
    }
  </div>
)}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/* 🔥 STYLES */
const card = {
  background: 'linear-gradient(145deg,#fff,#f8f9ff)',
  padding: 20,
  borderRadius: 18,
  marginBottom: 20,
  boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
}

const cardFlex = {
  ...card,
  display: 'flex',
  gap: 20,
  alignItems: 'center'
}

const avatar = {
  width: 70,
  height: 70,
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid #6c63ff'
}

const title = {
  fontSize: 26,
  fontWeight: 800
}

const subText = {
  color: '#777',
  fontSize: 14
}

const stars = {
  fontSize: 14,
  color: '#ffd600'
}

const price = {
  fontSize: 28,
  fontWeight: 800,
  color: '#6c63ff'
}

const sectionTitle = {
  fontWeight: 700,
  marginBottom: 12
}

const reviewItem = {
  borderBottom: '1px solid #eee',
  paddingBottom: 10,
  marginBottom: 10
}

const reviewHeader = {
  display: 'flex',
  justifyContent: 'space-between'
}

const starBtn = {
  width: 36,
  height: 36,
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer'
}

const textarea = {
  width: '100%',
  padding: 10,
  borderRadius: 10,
  border: '1px solid #ddd',
  marginBottom: 10
}

const btnPrimary = {
  padding: '10px 20px',
  borderRadius: 10,
  border: 'none',
  background: 'linear-gradient(90deg,#6c63ff,#00c6ff)',
  color: '#fff',
  cursor: 'pointer'
}

const slotBtn = {
  display: 'block',
  width: '100%',
  padding: 10,
  borderRadius: 10,
  border: 'none',
  marginBottom: 8,
  cursor: 'pointer'
}

const loader = {
  width: 60,
  height: 60,
  border: '6px solid rgba(108,99,255,0.2)',
  borderTop: '6px solid #6c63ff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
}