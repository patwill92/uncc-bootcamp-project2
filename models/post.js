const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  let Post = sequelize.define("Post", {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    img: {
      type: DataTypes.BLOB('medium'),
      len: [1]
    },
    imgType: {
      type: DataTypes.STRING,
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
    },
    tribute_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    type: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });
  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    Post.hasMany(models.Comment)
  };
  return Post;
};
