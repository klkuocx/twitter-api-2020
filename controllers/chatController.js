// models
const { User, ChatRoom, ChatMessage } = require('../models')

const chatController = {
  initiateChatRoom: async (req, res, next) => {
    try {
      // Initiate a chat between users
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
