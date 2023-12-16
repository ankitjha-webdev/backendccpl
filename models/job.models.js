const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define("job", {
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Title cannot be null"
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Description cannot be null"
          }
        }
      },
      requirements: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Requirements cannot be null"
          }
        }
      },
      experience: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Experience cannot be null"
          }
        }
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Location cannot be null"
          }
        }
      },
      desiredSkillsAndExperience: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Desired Skills & Experience cannot be null"
          }
        }
      },
      highlyDesiredSkills: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Highly Desired Skills cannot be null"
          }
        }
      },
      preferredEducationalBackground: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Preferred Educational Background cannot be null"
          }
        }
      },
      keyBenefits: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Key Benefits cannot be null"
          }
        }
      },
    },{ timestamps: true });
  
    return Job;
  };