const helpers = require('../_helpers')

const db = require('../models')
const Like = db.Like
const Tweet = db.Tweet

const likeController = {
  like: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        return res.status(400).json({ message: 'this tweet not exist' })
      }
      if (tweet.UserId === userId) {
        return res.status(400).json({ message: "Don't be narcissism" })
      }
      const [ like, created ] = await Like.findOrCreate({
        where: { TweetId: Number(tweetId), UserId: Number(userId) },
        default: { UserId: Number(userId) }
      })
      if (!created) {
        return res.status(400).json({ message: 'Already Liked' })
      }
      return res.json({ message: `like tweet ${tweetId} successfully`, like })
    } catch (err) {
      next()
    }
  },
  unlike: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        return res.status(400).json({ message: 'this tweet not exist' })
      }
      const like = await Like.findOne({
        where: {
          UserId: userId,
          TweetId: tweetId
        }
      })
      if (!like) {
        return res.status(400).json({ message: 'unlike not exist' })
      }
      const unliked = await like.destroy()
      return res.json({ message: `unlike tweet ${tweetId} successfully`, unliked })
    } catch (err) {
      next()
    }
  }
}

module.exports = likeController
