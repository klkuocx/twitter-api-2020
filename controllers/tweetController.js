const helpers = require('../_helpers')

const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  readTweets: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        options: {
          attribute: ['id', 'UserId', 'description', 'createdAt', 'updatedAt']
        },
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
          { model: Like, attributes: ['UserId'] },
          { model: Reply, attributes: ['UserId'] }
        ]
      })
      await tweets.map(tweet => ({
        ...Object.keys(tweet.dataValues).reduce((result, key) => {
          result[key] = tweet[key]
          return result
        }, {}),
        isLiked: tweet.Likes.map(l => l.UserId).includes(userId),
        repliedCount: tweet.Replies.length,
        LikeCount: tweet.Likes.length,
        isSelf: tweet.UserId === userId
      }))
      return res.json(tweets)
    } catch (err) {
      next()
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const { description } = req.body
      if (!description || description.length > 140) {
        return res.status(400).json({ message: 'number of the words must between 1 ~ 140' })
      } else {
        const tweet = await Tweet.create({
          description: description,
          UserId: userId
        })
        return res.json({ message: 'tweet is successfully created', tweet })
      }
    } catch (err) {
      next()
    }
  },
  readTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      let tweet = await Tweet.findByPk(tweetId, {
        options: {
          attribute: ['id', 'UserId', 'description', 'createdAt', 'updatedAt']
        },
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
          { model: Reply, attributes: ['UserId'] },
          { model: Like, attributes: ['UserId'] }
        ]
      })
      if (!tweet) {
        return res.status(400).json({ message: 'tweet not exist' })
      }
      tweet = {
        ...Object.keys(tweet.dataValues).reduce((result, key) => {
          result[key] = tweet[key]
          return result
        }, {}),
        isLiked: tweet.Likes.map(l => l.UserId).includes(userId),
        repliedCount: tweet.Replies.length,
        LikeCount: tweet.Likes.length,
        isSelf: tweet.UserId === userId
      }
      return res.json(tweet)
    } catch (err) {
      next()
    }
  },
  updateTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      const { description } = req.body
      if (!description || description.length > 140) {
        return res.status(400).json({ message: 'number of the words must between 1 ~ 140' })
      }
      let tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        return res.status(400).json({ message: 'tweet not exist' })
      }
      if (tweet.UserId !== userId) {
        return res.status(403).json({ message: 'permission denied' })
      } else {
        tweet = await tweet.update({ description })
        return res.json({ message: 'Tweet is updated successfully', tweet })
      }
    } catch (err) {
      next()
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      let tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        return res.status(400).json({ message: 'tweet not exist' })
      }
      if (tweet.UserId !== userId) {
        return res.status(403).json({ message: 'permission denied' })
      }
      tweet = await tweet.destroy()
      return res.json({ message: 'Tweet is delete successfully', tweet })
    } catch (err) {
      next()
    }
  }
}
module.exports = tweetController
