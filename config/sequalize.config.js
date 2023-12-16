const dbConfig = require("./sequalize.db");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.PORT,
  freezeTableName: true,
  define: {
    timestamps: false, // true by default
  },
  dialectOptions: {
    connectTimeout: 20000, // default is 10s which causes occasional ETIMEDOUT errors (see https://stackoverflow.com/a/52465919/491553)
    ssl: {
        rejectUnauthorized: false, // Do not validate SSL certificate
    },
  },
  logging: process.env.NODE_ENV === "development" ? true : false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database.", err);
  });

const db = {};

db.Sequelize = Sequelize; 
db.sequelize = sequelize;

db.serviceRequest = require('../models/servicerequest.models')(sequelize, DataTypes);
db.businessEnquiry = require('../models/businessenquiry.models')(sequelize, DataTypes);
db.career = require('../models/career.models')(sequelize, DataTypes);
db.users = require('../models/user.models')(sequelize, DataTypes);
db.jobs = require('../models/job.models')(sequelize, DataTypes);
db.pageImages = require('../models/pageimages.models')(sequelize, DataTypes);

module.exports = db;

db.sequelize.sync({ force: false  }).then(() => {
  console.log("Dropped the database and re-synced. Oops, did I do that? 😅");
});
