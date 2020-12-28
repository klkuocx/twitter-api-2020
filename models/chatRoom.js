'use strict'
const db = require('../models')
const Room = db.Room

module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define(
    'ChatRoom',
    {
      UserId: DataTypes.INTEGER,
      RoomId: DataTypes.INTEGER
    },
    {
      //   getChatRoomsByUserId: {
      //     async function(userId) {
      //       try {
      //         const rooms = await this.find({ UserId: { $eq: [userId] } })
      //         return rooms
      //       } catch (error) {
      //         throw error
      //       }
      //     }
      //   }
      // },
      // {
      //   getChatRoomByRoomId: {
      //     async function(roomId) {
      //       try {
      //         const room = await this.findOne({ RoomId: { $eq: [userId] } })
      //         return room
      //       } catch (error) {
      //         throw error
      //       }
      //     }
      //   }
      // },
      // {
      //   initiateChat: {
      //     async function(userId, roomId) {
      //       try {
      //         const availableRoom = await this.findOne({include:{
      //           UserId: { $eq: [userId] },
      //           RoomId: { $eq: [roomId] }
      //         }})
      //         if (availableRoom) {
      //           return {
      //             isNew: false,
      //             message: 'retrieving an old chat room'
      //           }
      //         }
      //         const roomCheck = await Room.findOne({include:{
      //           RoomId: { $eq: [roomId] }
      //         }})
      //         if (!roomCheck) {
      //           return {
      //             newRoom : await Room.create({roomName: `${userId} chatroom`}),
      //             newChatRoom = await this.create({ userID, RoomId : newRoom.id})
      //           }
      //         }
      //         const newChatRoom = await this.create({ userID, RoomId : room.id})
      //         return {
      //           isNew: true,
      //           message: 'creating a new chatroom',
      //           RoomId: newRoom.id
      //         }
      //       } catch (error) {
      //         console.log('error on start chat method', error)
      //         throw error
      //       }
      //     }
      //   }
    }
  )
  ChatRoom.associate = function(models) {
    ChatRoom.belongsTo(models.Room)
    ChatRoom.belongsTo(models.User)
  }
  return ChatRoom
}
