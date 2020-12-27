module.exports = io => {
  io.on('connection', (socket) => {
    console.log('socket.io is connecting...')
    // define chatroom variables
    const users = {}
    const typers = {}

    // on connection status
    socket.on('connect', (userId) => {
      users[socket.id] = {
        socketId: socket.id,
        userId: userId
      }
      socket.broadcast.emit('connect', users[socket.id])
    })

    socket.on('disconnect', () => {
      delete users[socket.id]
    })

    // on room events
    socket.on('join', (room) => {
      socket.join(room)
      socket.to(room).emit('a new user has joined the room')
    })

    socket.on('leave', (room) => {
      socket.leave(room)
      socket.to(room).emit(`user ${socket.id} has left the room`)
    })

    // on message events
    socket.on('typing', (room) => {
      typers[socket.id] = 1
      socket.broadcast.to(room).emit('typing', {
        user: users[socket.id],
        typers: Object.keys(typers).length
      })
    })

    socket.on('stopped typing', (room) => {
      delete typers[socket.id]
      socket.broadcast.to(room).emit('stopped typing', Object.keys(typers).length)
    })

    socket.on('send message', (room, user, message) => {
      delete typers[socket.id]
      socket.broadcast.to(room).emit('send message', {
        user: user,
        message: message,
        typers: Object.keys(typers).length
      })
    })
  })
}
