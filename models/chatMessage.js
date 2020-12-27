'use strict'
module.exports = (sequelize, DataTypes) => {
  const ChatMessages = sequelize.define(
    'ChatMessages',
    {
      content: DataTypes.STRING,
      postUserId: DataTypes.INTEGER,
      RoomId: DataTypes.INTEGER
    },
    {
      createPostInChatRoom: {
        async function(chatRoomId, content, postedByUser) {
          try {
            const post = await this.create({
              chatRoomId,
              content,
              postedByUser
            })
            const aggregate = await this.findByPk(post.id)
            return aggregate
          } catch (error) {
            throw error
          }
        }
      }
    },
    {
      markMessageRead: {}
    },
    {
      getRecentConversation: {}
    }
  )
  ChatMessages.associate = function(models) {
    ChatMessages.belongsTo(models.Room)
    ChatMessages.belongsTo(models.User)
  }
  return ChatMessages
}
