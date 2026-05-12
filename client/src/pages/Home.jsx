import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>

      {/* Hero Section */}
      <div
        style={{
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '60px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Gradient Circle */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 600,
            background:
              'radial-gradient(circle, rgba(108,99,255,0.15) 0%, rgba(0,198,255,0.08) 60%, transparent 100%)',
            pointerEvents: 'none',
            borderRadius: '50%',
          }}
        />

        <div style={{ position: 'relative', maxWidth: 700 }}>

          {/* Badge */}
          <div
            className="fade-up"
            style={{
              display: 'inline-block',
              padding: '6px 20px',
              borderRadius: 30,
              fontSize: 13,
              marginBottom: 24,
              background:
                'linear-gradient(90deg, rgba(108,99,255,0.25), rgba(0,198,255,0.15))',
              border: '1px solid rgba(108,99,255,0.3)',
              color: '#5a54e8',
              fontWeight: 500,
              letterSpacing: 0.5,
            }}
          >
             India's smartest tutor marketplace
          </div>

          {/* Headline */}
          <h1
            className="fade-up-2"
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 900,
              fontSize: 'clamp(40px, 7vw, 80px)',
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              marginBottom: 24,
              color: '#222',
            }}
          >
            Find the perfect
            <br />

            <span
              style={{
                background: 'linear-gradient(90deg, #6c63ff, #00c6ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              tutor
            </span>{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #ff7a18, #ff3d77)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              for you
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="fade-up-3"
            style={{
              fontSize: 18,
              color: '#666',
              marginBottom: 50,
              lineHeight: 1.8,
            }}
          >
            Connect with expert tutors across every subject.
            <br />
            Browse, book sessions, and start learning today.
          </p>

          {/* Buttons */}
          <div
            className="fade-up-4"
            style={{
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/tutors"
              className="btn"
              style={{
                fontSize: 16,
                padding: '15px 35px',
                borderRadius: 12,
                background: 'linear-gradient(90deg, #6c63ff, #00c6ff)',
                color: '#fff',
                border: 'none',
                transition: 'all 0.3s ease',
              }}
            >
              Browse Tutors →
            </Link>
<Link to="/match" className="btn btn-primary" style={{ fontSize: 16, padding: '13px 30px' }}>
  ✦ Find My Match
</Link>
<Link to="/tutors" className="btn btn-outline" style={{ fontSize: 16, padding: '13px 30px' }}>
  Browse All Tutors
</Link>
            <Link
              to="/register"
              className="btn"
              style={{
                fontSize: 16,
                padding: '15px 35px',
                borderRadius: 12,
                background:
                  'linear-gradient(90deg, rgba(108,99,255,0.1), rgba(0,198,255,0.1))',
                border: '1px solid rgba(108,99,255,0.4)',
                color: '#6c63ff',
                transition: 'all 0.3s ease',
              }}
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f8f9ff, #eef1ff)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '64px 24px',
        }}
      >
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 900,
              fontSize: 36,
              textAlign: 'center',
              marginBottom: 50,
              color: '#222',
            }}
          >
            How it works
          </h2>

          <div
            className="grid-3"
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 30,
            }}
          >
            {[
              {
                n: '01',
                title: 'Search tutors',
                desc: 'Filter by subject, price and rating.',
                color: '#6c63ff',
              },
              {
                n: '02',
                title: 'Book a session',
                desc: 'Pick a slot and book instantly.',
                color: '#00c6ff',
              },
              {
                n: '03',
                title: 'Start learning',
                desc: 'Connect, learn and leave a review.',
                color: '#ff3d77',
              },
            ].map((f) => (
              <div
                key={f.n}
                className="card"
                style={{
                  background:
                    'linear-gradient(145deg, #ffffff, #f3f4ff)',
                  padding: 30,
                  borderRadius: 20,
                  boxShadow:
                    '0 10px 25px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    'translateY(-5px)';
                  e.currentTarget.style.boxShadow =
                    '0 15px 35px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 10px 25px rgba(0,0,0,0.08)';
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontWeight: 800,
                    fontSize: 48,
                    background: `linear-gradient(90deg, ${f.color}, #00c6ff)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    opacity: 0.4,
                  }}
                >
                  {f.n}
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontWeight: 700,
                    fontSize: 20,
                    marginTop: 8,
                  }}
                >
                  {f.title}
                </div>

                <div
                  style={{
                    color: '#666',
                    fontSize: 14,
                    marginTop: 8,
                  }}
                >
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}