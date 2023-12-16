module.exports = (sequelize, DataTypes) => {
    const PageImage = sequelize.define("pageImage", {
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
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: {
                    msg: "Name cannot be empty"
                }
            }
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "URL cannot be empty"
                },
                // isUrl: {
                //     msg: "URL must be a valid URL"
                // }
            }
        },
        alt_text: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: {
                    msg: "Alt text cannot be empty"
                }
            }
        },
        page_location: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: {
                    msg: "Page location cannot be empty"
                }
            }
        }
    });
    return PageImage;
};
