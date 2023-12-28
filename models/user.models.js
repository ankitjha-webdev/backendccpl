const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("users", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
          notNull: {
            msg: "ID cannot be null"
          },
          isInt: {
            msg: "ID must be an integer"
          }
        }
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Full name cannot be null"
          },
          is: {
            args: ["^[a-z]+(?: [a-z]+)?$", 'i'],
            msg: "Full name must be at least one word"
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "Email cannot be null"
          },
          isEmail: {
            msg: "Must be a valid email address"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password cannot be null"
          }
        }
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Phone number cannot be null"
          },
          len: {
            args: [10, 10],
            msg: "Phone number must be exactly 10 digits"
          }
        }
      },
      profile: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: ["^.*\\.(jpg|jpeg|png)$", 'i'],
            msg: "Profile must be a .jpg, .jpeg, or .png file"
          }
        }
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },{ 
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          const salt = await bcrypt.genSalt();
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    });
  
    Users.prototype.validPassword = async function(password) {
      return await bcrypt.compare(password, this.password);
    };
  
    Users.prototype.generatePasswordResetToken = function() {
      this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
      this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      return this.resetPasswordToken;
    };
  
    Users.prototype.verifyPasswordResetToken = function(token) {
      const isValidToken = crypto.timingSafeEqual(Buffer.from(this.resetPasswordToken, 'hex'), Buffer.from(token, 'hex'));
      const isNotExpired = this.resetPasswordExpires > Date.now() + 3600000; // 1 hour
      return isValidToken && isNotExpired;
    };
  
    return Users;
  };