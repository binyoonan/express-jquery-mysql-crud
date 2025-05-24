const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const indexRouter = require('./routes/index');
const boardsRouter = require('./routes/boards');
app.use('/', indexRouter);
app.use('/boards', boardsRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports = app;

