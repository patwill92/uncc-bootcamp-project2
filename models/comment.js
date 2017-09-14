const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  let Comment = sequelize.define("Comment", {
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    time: {
      type     : DataTypes.STRING,
      get      : function()  {
        let date = this.getDataValue('createdAt');
        return moment(date, moment.ISO_8601).fromNow();
      }
    }
  });
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    Comment.belongsTo(models.Post, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Comment;
};
