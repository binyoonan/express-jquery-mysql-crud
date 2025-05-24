const boards = require('../models/boardModel');

exports.getBoards = (req, res) => {

    boards.getBoards((err, boards) => {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.json(boards);
        } else {
            res.render('list', { title: '게시판', boards });
        }
    })

}

exports.insertForm = (req, res) => {

        res.render('create', { title: '글 작성하기' });

}

exports.getBoardById = (req, res) => {

    const boardId = req.params.id;

    boards.getBoardById(boardId, (err, board) => {
        if (err || !board) {
            return res.status(404).send('게시판을 찾을 수 없습니다.');
        }
        res.render('detail',{ board});
    });

}

exports.getBoardDetail = (req, res) => {

    const boardId = req.params.id;

    boards.getBoardById(boardId, (err, board) => {
        if (err || !board) {
            return res.status(404).send('게시판 정보를 찾을 수 없습니다.');
        }
        res.render('edit',{ board});
    });

}

exports.updateBoard = (req, res) => {
    const boardId = req.params.id;
    const { title, content } = req.body;

    boards.updateBoard(boardId, { title, content }, (err, board) => {
        if (err || !board) {
            return res.status(404).json({ success: false, error: "게시판 정보를 수정할 수 없습니다." });
        }
        res.json({ success: true, message: "게시판이 수정되었습니다.", boardId });
    });
};

exports.deleteBoard = (req, res) => {

    const boardId = req.params.id;

    boards.deleteBoard(boardId, (err) => {
        if (err) {
            return res.status(404).send('게시판 삭제에 실패하였습니다.');
        }
        res.redirect(`/boards/list`);
    });

}

exports.insertBoard = (req, res) => {

    const {title, content} = req.body;

    boards.insertBoard({title, content}, (err, board) => {
        if (err || !board) {
            return res.status(404).json({ success: false, error: "게시판을 저장할 수 없습니다." });
        }
        res.json({ success: true, message: "게시판이 저장되었습니다.", boardId: board.insertId });
    });

}