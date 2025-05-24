require('dotenv').config();

module.exports = {
    host: process.env.DB_HOST,
    port: process.env.PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};
