import { useState, useEffect, useRef } from 'react'
import { getMyConversations, getConversation, sendMessage } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv]       = useState(null)
  const [messages, setMessages]           = useState([])
  const [text, setText]                   = useState('')
  const [loading, setLoading]             = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    getMyConversations().then(({ data }) => setConversations(data)).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (activeConv) {
      const otherId = activeConv.sender._id === user._id
        ? activeConv.receiver._id
        : activeConv.sender._id
      getConversation(otherId).then(({ data }) => setMessages(data))
    }
  }, [activeConv])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || !activeConv) return
    const otherId = activeConv.sender._id === user._id
      ? activeConv.receiver._id
      : activeConv.sender._id
    const { data } = await sendMessage({ receiverId: otherId, message: text })
    setMessages(prev => [...prev, data])
    setText('')
  }

  const getOther = (conv) =>
    conv.sender._id === user._id ? conv.receiver : conv.sender

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
  }}>Messages</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, height: '70vh' }}>

        {/* Conversation list */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-head)', fontWeight: 700 }}>
            Conversations
          </div>
          {loading ? <div className="loader-wrap"><div className="loader" /></div>
            : conversations.length === 0
              ? <div style={{ padding: 24, color: 'var(--muted)', fontSize: 14, textAlign: 'center' }}>No conversations yet</div>
              : <div style={{ overflowY: 'auto', flex: 1 }}>
                {conversations.map(conv => {
                  const other = getOther(conv)
                  const isActive = activeConv?.conversationId === conv.conversationId
                  return (
                    <div key={conv._id} onClick={() => setActiveConv(conv)}
                      style={{
                        padding: '14px 20px', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center',
                        background: isActive ? 'rgba(108,99,255,.1)' : 'transparent',
                        borderBottom: '1px solid var(--border)',
                        borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                        transition: 'all 0.15s'
                      }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-head)', fontWeight: 800, color: '#fff', fontSize: 16
                      }}>{other.name?.[0]}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{other.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {conv.message}
                        </div>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span style={{ background: 'var(--accent)', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
          }
        </div>

        {/* Chat window */}
        <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!activeConv ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 18 }}>Select a conversation</div>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                  {getOther(activeConv).name?.[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{getOther(activeConv).name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'capitalize' }}>{getOther(activeConv).role}</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.map(msg => {
                  const isMine = msg.sender._id === user._id
                  return (
                    <div key={msg._id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '70%', padding: '10px 14px', borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: isMine ? 'var(--accent)' : 'var(--bg3)',
                        color: isMine ? '#fff' : 'var(--text)', fontSize: 14, lineHeight: 1.5
                      }}>
                        {msg.message}
                        <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: 'right' }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                <input className="form-input" value={text} onChange={e => setText(e.target.value)}
                  placeholder="Type a message…" style={{ flex: 1 }} />
                <button className="btn btn-primary" type="submit" disabled={!text.trim()}>Send</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}