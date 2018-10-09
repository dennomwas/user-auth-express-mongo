const express = require('express');
const router = express.Router();

// local imports
const User = require('../models/user');
const mid = require('../middleware')

// GET /
router.get('/', function (req, res, next) {
    return res.render('index', {
        title: 'Home'
    });
});

// GET /about
router.get('/about', function (req, res, next) {
    return res.render('about', {
        title: 'About'
    });
});

// GET /contact
router.get('/contact', function (req, res, next) {
    return res.render('contact', {
        title: 'Contact'
    });
});

// GET /register
router.get('/register', mid.loggedOut, (req, res, next) => {
    res.render('register', {
        title: 'Sign Up'
    });
});

// POST /register
router.post('/register', (req, res, next) => {
    const {
        email,
        name,
        favoriteBook,
        password,
        confirmPassword
    } = req.body;
    console.log(email);
    if (email && name && favoriteBook && password && confirmPassword) {
        if (password !== confirmPassword) {
            const err = new Error('Passwords must match!')
            err.status = 400;
            return next(err);
        }
        // create object with form input
        const userData = {
            email: email,
            name: name,
            favoriteBook: favoriteBook,
            password: password
        }
        // use Schema's 'create' method to insert document into mongo

        User.create(userData, (error, user) => {
            if (error) {
                return error;
            }
            req.session.userID = user._id;
            return res.redirect('/profile')
        });
    } else {
        const err = new Error('All fields are required!');
        err.status = 400;
        return next(err);
    }
});

// GET /login
router.get('/login', mid.loggedOut, (req, res, next) => {
    res.render('login', {
        title: 'Log In'
    });
});

// POST /login
router.post('/login', (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    if (email && password) {
        User.authenticate(email, password, (error, user) => {
            if (error || !user) {
                const err = new Error('Wrong Email/Password Combination!')
                err.status = 401;
                return next(err);
            } else {
                req.session.userID = user._id;
                return res.redirect('/profile');
            };
        });

    } else {
        const err = new Error("Email/Password must be provided");
        err.status = 401;
        return next(err);
    };
});

// GET /profile
router.get('/profile', mid.requiresLogin, (req, res, next) => {
    currentUser = req.session.userID;
    User.findById(currentUser)
        .exec((error, user) => {
            if (error) {
                return next(error)
            } else {
                return res.render('profile', {
                    title: 'Profile',
                    name: user.name,
                    favorite: user.favoriteBook
                });
            };
        });
});

// GET /logout
router.get('/logout', (req, res, next) => {
    if (req.session) {
        // delete session object
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});
module.exports = router;