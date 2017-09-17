module.exports = function (sequelize, DataTypes) {
  let User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    img: {
      type: DataTypes.BLOB,
      allowNull: false,
      len: [1]
    },
    imgType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1]
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });
  User.associate = (models) => {
    User.hasMany(models.Post)
  };
  return User;
};
