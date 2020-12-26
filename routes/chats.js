const express = require('express')
const router = express.Router()

const chatController = require('../controllers/chatController')

router.get('/', chatController.getRecentConversation)
router.get('/:roomId', chatController.getConversationByRoomId)
router.post('/initiate', chatController.initiate)
router.post('/:roomId/message', chatController.postMessage)
router.put('/:roomId/mark-read', chatController.markConversationReadByRoomId)

module.exports = router
