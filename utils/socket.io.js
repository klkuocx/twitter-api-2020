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

    // // disconnect and leave public room
    // socket.on('disconnect', () => {
    //   // remove socket.id from onlineUsers
    //   onlineUsers[user.id].socketIds.delete(socket.id)
    //   // update onlineUsers to frontend
    //   io.emit('onlineUsers', {
    //     onlineUsers: onlineUsers,
    //     countOfUsers: Object.keys(onlineUsers).length
    //   })
    //   // send message to all users in public room except sender
    //   socket.broadcast.to('public room').emit('leaveRoom', `user: ${user.name} is offline`)
    // })

    // // user send message
    // socket.on('clientSendMessage', message => {
    //   if (!message) return
    //   io.in('public room').emit('serverSendMessage', {
    //     user: user,
    //     message: message,
    //     timestamp: new Date()
    //   })
    // })

    // // user is typing
    // socket.on('typing', room => {
    //   socket.broadcast.to(room).emit('typing', `user: ${user.name} is typing`)
    // })
  })
}
