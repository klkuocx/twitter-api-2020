// require middleware
const { authenticateBySocket } = require('../middleware/auth')

// define socket related variable
const onlineUsers = {}
/*
{
  1: user1Obj,
  2: user2Obj,
  ...
}
*/
// onlineUsersArr = [ user1Obj, user2Obj, ... ]

module.exports = io => {
  // authenticate and get user
  io.use(authenticateBySocket).on('connection', socket => {
    const currentUser = socket.request.user
    console.info(`======Socket.IO======`)
    console.log(`user(socket.id: ${socket.id}, userId: ${currentUser.id}, name: ${currentUser.name}) is connecting`)
    console.info(`======Socket.IO======`)

    //  when user is online
    socket.on('online', () => {
      // join public room and add to onlineUsers
      socket.join('publicRoom')
      if (!Object.keys(onlineUsers).includes(currentUser.id)) {
        onlineUsers[currentUser.id] = currentUser
      }
      console.info(`add currentUser to onlineUser[${currentUser.id}]`, onlineUsers)

      // update onlineUsers to clients
      io.emit('onlineUsers', {
        onlineUsers: Object.values(onlineUsers),
        countOfUsers: Object.keys(onlineUsers).length
      })
      // send message to all users in public room except sender
      socket.broadcast.to('publicRoom').emit('joinRoom', {
        user: currentUser,
        content: `user: ${currentUser.name} is online`,
        createdAt: new Date()
      })
    })

    // disconnect and leave public room
    socket.on('disconnect', () => {
      // remove currentUser from onlineUsers
      if (Object.keys(onlineUsers).includes(currentUser.id)) {
        delete onlineUsers[currentUser.id]
        console.info(`remove currentUser from onlineUsers[${currentUser.id}]`, onlineUsers)

        // update onlineUsers to client
        io.emit('onlineUsers', {
          onlineUsers: Object.values(onlineUsers),
          countOfUsers: Object.keys(onlineUsers).length
        })

        // send message to all users in public room except sender
        socket.broadcast.to('publicRoom').emit('leaveRoom', {
          user: currentUser,
          content: `user: ${currentUser.name} is offline`,
          createdAt: new Date()
        })
      }
    })

    // when user send message
    socket.on('sendMessage', payload => {
      const { room, message } = payload
      if (!message.trim()) return
      socket.broadcast.to(room).emit('sendMessage', {
        user: currentUser,
        content: message.trim(),
        createdAt: new Date()
      })
    })

    // when user is typing
    socket.on('typing', room => {
      socket.broadcast.to(room).emit('typing', `user: ${currentUser.name} is typing`)
    })
  })
}
