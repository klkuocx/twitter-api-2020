const helpers = require('../_helpers')

const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  readTweets: (req, res) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Like, Reply]
    })
      .then(tweets => {
        tweets = tweets.map(tweet => ({
          ...Object.keys(tweet.dataValues)
            .slice(0, 6)
            .reduce((result, key) => {
              result[key] = tweet[key]
              return result
            }, {}),
          isLiked: tweet.Likes.map(l => l.UserId).includes(helpers.getUser(req).id),
          repliedCount: tweet.Replies.length,
          LikeCount: tweet.Likes.length
        }))
        return res.json({ status: 'success', message: 'OK', tweets })
      })
      .catch(err => {
        return res.json({ status: 'failure', message: 'Errors' })
      })
  },
  postTweet: (req, res) => {}
}

module.exports = tweetController
