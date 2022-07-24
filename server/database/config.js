const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host:'korex-dev-db.cewuqg5n85w2.ap-northeast-2.rds.amazonaws.com',
    port:3306,
    user:'pref_user',
    password:'vmfpvm$3909',
    database:'korex_pref',
    connectionLimit: 100,
    dateStrings: 'date'
});

module.exports = pool;
