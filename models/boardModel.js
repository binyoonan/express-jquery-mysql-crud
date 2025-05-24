const db = require('./db');
const req = require("express/lib/request");

exports.getBoards = (callback) => {

    const sql = "SELECT * FROM boards ORDER BY created_at DESC";

    db.query(sql, callback);

}

exports.getBoardById = (boardId, callback) => {

    const sql = "SELECT * FROM boards WHERE id = ?";

    db.query(sql,[boardId], (err, result) => {
        if (err) return callback(err, null);
        if (result.length > 0) {
            callback(null, result[0]);
        } else {
            callback(null, null);
        }
    });

}

exports.updateBoard = (boardId, updatedData, callback) => {

    const {title, content} = updatedData;
    const sql = "UPDATE boards SET title = ?, content = ? WHERE id = ?";

    db.query(sql, [title, content, boardId], (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });

}

exports.deleteBoard = (boardId, callback) => {

    const sql = "DELETE FROM boards WHERE id = ?";

    db.query(sql,[boardId], (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });

}

exports.insertBoard = (newBoard, callback) => {

    const {title, content} = newBoard;
    const sql = "INSERT INTO boards (title, content) VALUES (?,?)";

    db.query(sql, [title, content], (err, board) => {
        if (err) {
            return callback(err);
        }
        callback(null, board);
    });

}
