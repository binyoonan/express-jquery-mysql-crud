const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

router.get('/list', boardController.getBoards);

router.get('/detail/:id', boardController.getBoardById);

router.get('/edit/:id', boardController.getBoardDetail);

router.post('/update/:id', boardController.updateBoard);

router.get('/delete/:id', boardController.deleteBoard)

router.get('/insertForm', boardController.insertForm);

router.post('/insert', boardController.insertBoard);

module.exports = router;