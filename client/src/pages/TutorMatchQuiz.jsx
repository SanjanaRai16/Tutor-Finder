import { useState } from 'react'
import { getTutors } from '../services/api'
import TutorCard from '../components/TutorCard'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  {
    id: 'subject',
    question: 'What subject do you need help with?',
    options: ['Mathematics','Physics','Chemistry','Biology','English','Hindi','History','Computer Science','Economics']
  },
  {
    id: 'level',
    question: 'What is your current level?',
    options: ['Beginner', 'Intermediate', 'Advanced', 'Competitive Exam']
  },
  {
    id: 'style',
    question: 'What is your preferred learning style?',
    options: ['Visual (diagrams & examples)', 'Practice-heavy (lots of problems)', 'Conceptual (theory first)', 'Mixed approach']
  },
  {
    id: 'budget',
    question: 'What is your budget per hour?',
    options: ['Under ₹300', '₹300–₹600', '₹600–₹1000', 'Above ₹1000']
  },
  {
    id: 'days',
    question: 'Which days are you available?',
    options: ['Weekdays only', 'Weekends only', 'Any day']
  }
]

const BUDGET_MAP = {
  'Under ₹300':    { maxRate: 300 },
  '₹300–₹600':    { minRate: 300, maxRate: 600 },
  '₹600–₹1000':   { minRate: 600, maxRate: 1000 },
  'Above ₹1000':   { minRate: 1000 }
}

export default function TutorMatchQuiz() {
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleAnswer = (val) => {
    const newAnswers = { ...answers, [STEPS[step].id]: val }
    setAnswers(newAnswers)
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      runMatch(newAnswers)
    }
  }

  const runMatch = async (ans) => {
    setLoading(true)
    try {
      const budgetFilter = BUDGET_MAP[ans.budget] || {}
      const params = { subject: ans.subject, ...budgetFilter }
      const { data } = await getTutors(params)

      // Score each tutor based on answers
      const scored = data.map(tutor => {
        let score = 0
        const p = tutor.tutorProfile || {}

        // Subject match (already filtered)
        score += 30

        // Budget fit bonus
        if (p.hourlyRate) score += 20

        // Rating bonus
        if (p.avgRating >= 4.5) score += 25
        else if (p.avgRating >= 3.5) score += 15
        else if (p.avgRating > 0) score += 5

        // Review count bonus
        if (p.reviewCount >= 10) score += 15
        else if (p.reviewCount >= 5) score += 10
        else if (p.reviewCount > 0) score += 5

        // Availability day match
        const slots = p.availableSlots || []
        const isWeekend = (d) => ['Saturday','Sunday'].includes(d)
        const isWeekday = (d) => !isWeekend(d)
        if (ans.days === 'Weekends only' && slots.some(s => isWeekend(s.day))) score += 10
        if (ans.days === 'Weekdays only' && slots.some(s => isWeekday(s.day))) score += 10
        if (ans.days === 'Any day') score += 10

        return { ...tutor, matchScore: score }
      })

      scored.sort((a, b) => b.matchScore - a.matchScore)
      setResults(scored.slice(0, 6))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setStep(0); setAnswers({}); setResults(null) }

  // Results screen
  if (results) return (
    <div className="page">
      <div className="fade-up" style={{ marginBottom: 32 }}>
        
        <h1 className="page-title"style={{
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
    Your Top Matches
    </h1>
        <p style={{ color: 'var(--muted)' }}>
          Based on: <strong style={{ color: 'var(--text)' }}>{answers.subject}</strong> ·
          <strong style={{ color: 'var(--text)' }}> {answers.level}</strong> ·
          <strong style={{ color: 'var(--text)' }}> {answers.budget}</strong>
        </p>
      </div>

      {loading ? <div className="loader-wrap"><div className="loader" /></div>
        : results.length === 0
          ? (
            <div style={{ textAlign: 'center', padding: 80 }}>
              <div style={{ fontSize: 48 }}>😔</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 22, marginTop: 16 }}>No matches found</div>
              <p style={{ color: 'var(--muted)', marginTop: 8 }}>Try different preferences</p>
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={reset}>Try Again</button>
            </div>
          ) : (
            <>
              <div className="grid-3" style={{ marginBottom: 28 }}>
                {results.map((t, i) => (
                  <div key={t._id} style={{ position: 'relative' }}>
                    {i === 0 && (
                      <div style={{ position: 'absolute', top: -10, left: 16, zIndex: 1, background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                        🏆 Best Match
                      </div>
                    )}
                    <TutorCard tutor={t} />
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ flex: 1, height: 4, background: 'var(--bg3)', borderRadius: 2 }}>
                        <div style={{ width: `${t.matchScore}%`, height: 4, background: 'var(--accent3)', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--accent3)', fontWeight: 600 }}>{t.matchScore}% match</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline" onClick={reset}>Retake Quiz</button>
            </>
          )
      }
    </div>
  )

  // Quiz screen
  const current = STEPS[step]
  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>
            <span>Step {step + 1} of {STEPS.length}</span>
            <span>{Math.round(((step) / STEPS.length) * 100)}% complete</span>
          </div>
          <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2 }}>
            <div style={{ height: 4, background: 'var(--accent)', borderRadius: 2, width: `${(step / STEPS.length) * 100}%`, transition: 'width 0.4s' }} />
          </div>
        </div>

        <div className="card fade-up">
          <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 24, marginBottom: 8 }}>
            {current.question}
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>Select one option</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {current.options.map(opt => (
              <button key={opt} type="button" onClick={() => handleAnswer(opt)} style={{
                padding: '14px 18px', borderRadius: 12, textAlign: 'left',
                border: '1px solid var(--border)', background: 'var(--bg3)',
                color: 'var(--text)', cursor: 'pointer', fontSize: 15,
                fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(108,99,255,.08)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg3)' }}
              >
                {opt} <span style={{ color: 'var(--accent)', fontSize: 18 }}>→</span>
              </button>
            ))}
          </div>
          {step > 0 && (
            <button className="btn btn-outline btn-sm" style={{ marginTop: 20 }} onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
        </div>
      </div>
    </div>
  )
}