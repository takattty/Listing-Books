const mysql = require('mysql');

const dbConfig = {
    host:     'localhost',
    user:     'root',
    password: 'TaKaTo0814',
    port:     3306,
    database: 'sharechat_test'
};

const connection = mysql.createConnection(dbConfig);

module.exports = connection;