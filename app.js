const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const app = express();

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// connect to mongodb using mongoose
mongoose.connect('mongodb://localhost:27017/bookworm', {
    useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:')); //log mongo errors

// use session to track logins
app.use(session({
    secret: "Learn to express yourself",
    resave: true,
    saveUninitialized: false,
    store: new mongoStore({
        mongooseConnection: db
    })
}));

// make user ID available in all templates
app.use((req, res, next) => {
    res.locals.currentUser = req.session.userID;
    next();
});

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
const routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// listen on port 3000
app.listen(3000, function () {
    console.log('Express app listening on port 3000');
});