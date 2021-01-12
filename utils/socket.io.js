// require middleware
const { authenticateBySocket } = require('../middleware/auth')

// define socket related variable
/* onlineUsers = {
  1: {
    socketId: Set {sk1, sk2},
    user: {
      id: 1,
      account: @user1,
      name: user1,
      ...
    }
  }
} */
const onlineUsers = {}

module.exports = io => {
  // authenticate and get user
  io.use(authenticateBySocket).on('connection', socket => {
    const user = socket.request.user
    console.log(`user(socket.id: ${socket.id}, userId: ${user.id}, name: ${user.name}) is connecting`)

    // join public room and add to onlineUsers
    socket.join('public room')
    if (Object.keys(onlineUsers).includes(user.id)) {
      onlineUsers[user.id].socketIds.add(socket.id)
    } else {
      onlineUsers[user.id] = {
        socketIds: new Set(),
        user: user
      }
    }
    // update onlineUsers to frontend
    io.emit('onlineUsers', {
      onlineUsers: onlineUsers,
      countOfUsers: Object.keys(onlineUsers).length
    })
    // send message to all users in public room except sender
    socket.broadcast.to('public room').emit('joinRoom', `user: ${user.name} is online`)
  })
}
