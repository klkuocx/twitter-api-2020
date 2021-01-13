const helpers = require('../_helpers')

const db = require('../models')
const Followship = db.Followship
const User = db.User

const followshipController = {
  follow: async (req, res, next) => {
    try {
      const followerId = Number(helpers.getUser(req).id)
      const followingId = Number(req.body.id)
      let user = await User.findByPk(followingId)
      if (!user || user.role === 'admin') {
        return res.status(400).json({ message: 'this user not exist' })
      }
      if (followerId === followingId) {
        return res.status(400).json({ message: "Don't be narcissism" })
      }
      let [ follow, created ] = await Followship.findOrCreate({
        where: { followingId, followerId },
        default: { followingId, followerId }
      })
      if (!created) {
        return res.status(400).json({ message: 'Already Followed' })
      }
      return res.json({ message: `follow user ${followingId} successfully`, follow })
    } catch (err) {
      next()
    }
  },
  unfollow: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = req.params.followingId
      const user = await User.findByPk(followingId)
      if (!user || user.role === 'admin') {
        return res.status(400).json({ message: 'this user not exist' })
      }
      const following = await Followship.findOne({
        where: {
          followerId: followerId,
          followingId: followingId
        }
      })
      if (!following) {
        return res.status(400).json({ message: 'followship not exist' })
      }
      const unfollow = await following.destroy()
      return res.json({ message: `unfollow user ${followingId} successfully`, unfollow })
    } catch (err) {
      next()
    }
  }
}

module.exports = followshipController
