const mysql = require('mysql2');
const dbConfig = require('../config/db.config'); // db.config.js 파일 불러오기
const fs = require('fs');

// MySQL 연결 설정
const connection = mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database
});

const sql = fs.readFileSync('./sql/schema.sql', 'utf8');

connection.query(sql, (err, result) => {
    if (err) {
        console.error("SQL 실행오류" + err);
        return;
    }
    console.log("SQL 실행결과 : " + result);
})

// 연결 테스트
connection.connect((err) => {
    if (err) {
        console.error('데이터베이스 연결 실패: ', err.stack);
        return;
    }
    console.log('데이터베이스에 연결되었습니다.');
});

module.exports = connection;
