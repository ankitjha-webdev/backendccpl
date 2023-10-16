module.exports = {
    HOST: process.env.MYSQLDB_HOST,
    USER: process.env.MYSQLDB_USER,
    PASSWORD: process.env.MYSQLDB_PASS,
    DB: process.env.MYSQLDB,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 1,
        acquire: 60000,
        idle: 10000
    }
};