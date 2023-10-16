module.exports = (sequelize, DataTypes) => {
  const ServiceRequest = sequelize.define("service_request", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Full name is required"
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
          msg: "Email is required"
        },
        isEmail: {
          msg: "Email is not valid"
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Phone number is required"
        },
        is: {
          args: ["^[0-9]{10}$"],
          msg: "Phone number must be a 10-digit number"
        }
      }
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Company name is required"
        },
        is: {
          args: ["^[a-zA-Z ]*$"],
          msg: "Company name must only contain alphabetic characters"
        }
      }
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Subject is required"
        },
        isIn: {
          args: [["Structured Cabling", "Audio Visuals"]],
          msg: "Subject must be one of: Structured Cabling, Audio Visuals"
        }
      }
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Message is required"
        },
        len: {
          args: [100],
          msg: "Message must be at least 100 characters"
        }
      }
    },
    ticket_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // defaultValue: () => {
      //   return generateRandomTicketNumber();
      // }
    }
  }, { timestamps: true });

  return ServiceRequest;
};
