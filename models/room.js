'use strict'
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    'Room',
    {
      roomName: DataTypes.TEXT
    },
    {}
  )
  Room.associate = function(models) {
    Room.hasMany(models.ChatRoom)
    Room.hasMany(models.ChatMessages)
  }
  return Room
}
