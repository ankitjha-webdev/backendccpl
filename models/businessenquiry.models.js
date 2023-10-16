module.exports = (sequelize, DataTypes) => {
  const BusinessEnquiry = sequelize.define("business_enquiry", {
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
      unique: true,
      validate: {
        notNull: {
          msg: "Email is required"
        },
        isEmail: {
          msg: "We couldn't recognize the email format you entered. Please provide a valid email address."
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
          args: [["All", "Structured Cabling", "Audio Visuals"]],
          msg: "Subject must be one of: All, Structured Cabling, Audio Visuals"
        }
      }
    },
    message: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Message is required"
        },
        len: {
          args: [1, 500],
          msg: "Message must be between 1 and 500 characters"
        }
      }
    },
  }, {
    timestamps: true
  });

  return BusinessEnquiry;
};