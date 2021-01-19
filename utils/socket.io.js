// require middleware
// const { authenticateBySocket } = require('../middleware/auth')

// define socket related variable
const onlineUsers = {} // {1:[sk1,sk2,...], 2:[...],...}

module.exports = io => {
  // authenticate and get user
  // io.use(authenticateBySocket).on('connection', socket => {
  //   const user = socket.request.user
  //   console.log(`user(socket.id: ${socket.id}, userId: ${user.id}, name: ${user.name}) is connecting`)
  io.on('connection', socket => {
    console.info(`======Socket.IO======`)
    console.info(`socket.id: ${socket.id} is connecting...`)
    console.info(`socket.conn: ${socket.conn}`)
    console.info(`socket.request: ${socket.request}`)
    console.info(`======Socket.IO======`)

    //  when user is online
    socket.on('online', userId => {
      // join public room and add to onlineUsers
      socket.join('publicRoom')
      if (Object.keys(onlineUsers).includes(userId)) {
        onlineUsers[userId].add(socket.id)
      } else {
        onlineUsers[userId] = new Set([socket.id])
      }
      console.info(`add socket in onlineUser[${userId}]`, onlineUsers)

      // update onlineUsers to clients
      io.emit('onlineUsers', {
        onlineUsers: onlineUsers,
        countOfUsers: Object.keys(onlineUsers).length
      })
      // send message to all users in public room except sender
      socket.broadcast.to('publicRoom').emit('joinRoom', `user: ${userId} is online`)
    })

    // disconnect and leave public room
    socket.on('disconnect', () => {
      // remove socket.id from onlineUsers
      Object.keys(onlineUsers).forEach(userId => {
        const userSet = onlineUsers[userId]
        if (userSet.has(socket.id)) {
          userSet.delete(socket.id)
          console.info(`remove socket from onlineUser[${userId}]`, onlineUsers)
          // update onlineUsers to client
          io.emit('onlineUsers', {
            onlineUsers: onlineUsers,
            countOfUsers: Object.keys(onlineUsers).length
          })
        }
        if (!userSet.size) {
          // send message to all users in public room except sender
          socket.broadcast.to('publicRoom').emit('leaveRoom', `user: ${userId} is offline`)
        }
      })
    })

    // when user send message
    socket.on('sendMessage', payload => {
      const { userId, room, message } = payload
      if (!message.trim()) return
      socket.broadcast.to(room).emit('sendMessage', {
        userId: userId,
        content: message.trim(),
        createdAt: new Date()
      })
    })

    // // user is typing
    // socket.on('typing', room => {
    //   socket.broadcast.to(room).emit('typing', `user: ${user.name} is typing`)
    // })
  })
}
