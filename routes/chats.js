const express = require('express')
const router = express.Router()

const chatController = require('../controllers/chatController')

router.post('/initiate', chatController.initiateChatRoom)
router.get('/:roomId', chatController.getChatRoom)
router.post('/:roomId/message', chatController.postMessage)
router.put('/:roomId/mark-read', chatController.markMessageRead)

module.exports = router
