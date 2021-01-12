// require middleware
const { authenticateBySocket } = require('../middleware/auth')

// define socket related variable
const onlineUsers = {}

module.exports = io => {
  io.use(authenticateBySocket).on('connection', socket => {
    const user = socket.request.user
    console.log(`user(socket.id: ${socket.id}, userId: ${user.id}, name: ${user.name}) is connecting`)
  })
}
