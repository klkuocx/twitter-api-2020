// models
const { User, Room, ChatRoom, ChatMessage } = require('../models')

const chatController = {
  initiateChatRoom: async (req, res, next) => {
    try {
      // get userIds arr and roomName str
      const { userIds, roomName } = req.body
      // Initiate a chat between users
      const room = await Room.creatRoom(roomName)
      const chatRoom = await ChatRoom.initiateChatRoom(userIds, room.id)
      res.json({ message: `${userIds[0]} and ${userIds[1]} start a chatroom`, chatRoom })
    } catch (err) { next(err) }
  },

  getChatRoom: async (req, res, next) => {
    try {
      // get users in chatroom
      // get messages in chatroom
    } catch (err) { next(err) }
  },

  postMessage: async (req, res, next) => {
    try {
      // post message
    } catch (err) { next(err) }
  },

  markMessageRead: async (req, res, next) => {
    try {
      // mark messages read
    } catch (err) { next(err) }
  }
}

module.exports = chatController
