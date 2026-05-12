import express from 'express'
import { sendMessage, getConversation, getMyConversations } from '../controllers/messageController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()
router.post('/',                protect, sendMessage)
router.get('/conversations',    protect, getMyConversations)
router.get('/:userId',          protect, getConversation)
export default router