const helpers = require('../_helpers')

const db = require('../models')
const Reply = db.Reply
const User = db.User
const Tweet = db.Tweet

const replyController = {
  readReplies: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(tweetId, {
        include: { model: Reply, include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }] },
        order: [['createdAt', 'DESC']]
      })
      if (!tweet) {
        return res.status(400).json({ message: 'this tweet not exist' })
      }
      const replies = await tweet.Replies.map(reply => ({
        ...reply.dataValues,
        isSelf: reply.UserId === userId
      }))
      return res.json(replies)
    } catch (err) {
      next()
    }
  },
  postReply: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      const { comment } = req.body
      if (!comment) {
        return res.status(400).json({ message: "number of the words can't be less than 1" })
      }
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        return res.status(400).json({ message: 'this tweet not exist' })
      }
      const reply = await Reply.create({
        comment,
        TweetId: req.params.id,
        UserId: userId
      })
      return res.json({ message: 'Reply created successfully', reply })
    } catch (err) {
      next()
    }
  },
  updateReply: async (req, res, next) => {
    try {
      const tweetId = req.params.tweetId
      const replyId = req.params.replyId
      const userId = helpers.getUser(req).id
      const { comment } = req.body
      if (!comment) {
        return res.status(400).json({ message: "number of words can't be less than 1" })
      }
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        return res.status(400).json({ message: 'tweet not exist' })
      }
      let reply = await Reply.findByPk(replyId)
      if (!reply) {
        return res.status(400).json({ message: 'reply not exist' })
      }
      if (reply.UserId !== userId) {
        return res.status(403).json({ message: 'permission denied' })
      }
      reply = await reply.update({ comment: comment })
      return res.json({ message: 'Reply is updated successfully', reply })
    } catch (err) {
      next()
    }
  },
  deleteReply: async (req, res, next) => {
    try {
      const tweetId = req.params.tweetId
      const replyId = req.params.replyId
      const userId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        return res.status(400).json({ message: 'tweet not exist' })
      }
      let reply = await Reply.findByPk(replyId)
      if (!reply) {
        return res.status(400).json({ message: 'reply not exist' })
      }
      if (reply.UserId !== userId) {
        return res.status(403).json({ message: 'permission denied' })
      }
      reply = await reply.destroy()
      return res.json({ message: 'Reply is delete successfully', reply })
    } catch (err) {
      next()
    }
  }
}

module.exports = replyController
