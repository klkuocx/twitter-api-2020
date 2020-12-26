class WebSockets {
  users = []
  connection(socket) {
    // event fired when the chat room is disconnected
    socket.on('disconnect', () => {
      this.users = this.users.filter((user) => user.socketId !== socket.id)
    })
    // add identity of user mapped to the socket id
    socket.on('identity', (userId) => {
      this.users.push({
        socketId: socket.id,
        userId: userId,
      })
    })
    socket.emit('join', (room, otherUserId))
    // subscribe person to chat & other user as well
    socket.on('join', (room, otherUserId = '') => {
      this.subscribeOtherUser(room, otherUserId)
      socket.join(room)
      socket.to(room).emit('a new user has joined the room')
    })
    // mute a chat room
    socket.on('leave', (room) => {
      socket.leave(room)
      io.to(room).emit(`user ${socket.id} has left the room`)
    })
  }

  subscribeOtherUser(room, otherUserId) {
    const userSockets = this.users.filter(
      (user) => user.userId === otherUserId
    )
    userSockets.map((userInfo) => {
      const socketConn = io.sockets.connected(userInfo.socketId)
      if (socketConn) {
        socketConn.join(room)
      }
    })
  }
}

module.exports = new WebSockets()
