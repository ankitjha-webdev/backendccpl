const validator = require('validator');
module.exports = (sequelize, DataTypes) => {
    const Career = sequelize.define("career", {
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
        validate: {
          notNull: {
            msg: "Email cannot be null"
          },
          isEmail: {
            msg: "Must be a valid email address"
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
      resume: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            // args: ["^.*\\.(doc|docx|pdf)$", 'i'],
            // msg: "Resume must be a .doc, .docx, or .pdf file"
            args: ["^.*\\.(pdf)$", 'i'],
            msg: "Resume must be a .pdf file"
          }
        }
      },
    },{ timestamps: true });
  
    return Career;
  };