const express = require('express');
const router = express.Router();

// local imports
const User = require('../models/user');

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
router.get('/register', (req, res, next) => {
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
    console.log(email, name);
});

module.exports = router;