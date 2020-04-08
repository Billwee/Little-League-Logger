var crypto = require("crypto");
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          len: [5, 75],
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return () => this.getDataValue('password')
        }
      },
      salt: {
        type: DataTypes.STRING,
        get() {
          return() => this.getDataValue('salt')
        }
      },
      coach: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      team: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1],
        },
      },
    },
    {
      timestamps: false,
    }
  );
  User.generateSalt = function() {
    return crypto.randomBytes(16).toString('base64')
  }
  User.encryptPassword = function(plainText, salt) {
    return crypto
        .createHash('RSA-SHA256')
        .update(plainText)
        .update(salt)
        .digest('hex')
  }
  const setSaltAndPassword = user => {
    if (user.changed('password')) {
        user.salt = User.generateSalt()
        user.password = User.encryptPassword(user.password(), user.salt())
    }
}
User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
User.prototype.correctPassword = function(enteredPassword) {
  return User.encryptPassword(enteredPassword, this.salt()) === this.password()
}
  return User;
};
