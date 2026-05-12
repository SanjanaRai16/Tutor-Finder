import Message from '../models/Message.js'

// Generate consistent conversation ID between 2 users
const getConversationId = (id1, id2) => {
  return [id1, id2].sort().join('_')
}

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body
    const conversationId = getConversationId(req.user.id, receiverId)
    const msg = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      message,
      conversationId
    })
    await msg.populate('sender', 'name role')
    await msg.populate('receiver', 'name role')
    res.status(201).json(msg)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getConversation = async (req, res) => {
  try {
    const conversationId = getConversationId(req.user.id, req.params.userId)
    const messages = await Message.find({ conversationId })
      .populate('sender', 'name role')
      .populate('receiver', 'name role')
      .sort({ createdAt: 1 })

    // Mark messages as read
    await Message.updateMany(
      { conversationId, receiver: req.user.id, isRead: false },
      { isRead: true }
    )

    res.json(messages)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getMyConversations = async (req, res) => {
  try {
    // Get all unique conversations for this user
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
      .populate('sender', 'name role')
      .populate('receiver', 'name role')
      .sort({ createdAt: -1 })

    // Get latest message per conversation
    const seen = new Set()
    const conversations = []
    for (const msg of messages) {
      if (!seen.has(msg.conversationId)) {
        seen.add(msg.conversationId)
        const unread = await Message.countDocuments({
          conversationId: msg.conversationId,
          receiver: req.user.id,
          isRead: false
        })
        conversations.push({ ...msg.toObject(), unreadCount: unread })
      }
    }
    res.json(conversations)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}