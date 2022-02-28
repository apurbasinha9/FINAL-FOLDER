const express = require('express');
const authController = require('../controllers/auth');
const middleware = authController.isLoggedIn;

const router = express.Router();

router.get('/', (req, res) => {
    res.render('Homepage');
});

router.get('/signin', (req, res) => {
    res.render('Signin', { message: '' });
})

router.get('/signup', (req, res) => {
    res.render('Signup', { message: '' });
})

router.get('/foodproducersforum', middleware, (req, res) => {
    if (req.user) {
        res.render('visual');
    } else {
        res.redirect('/signin');
    }
})

router.get('/seeds', middleware, (req, res) => {

    if (req.user) {
        res.render('Seeds');
    } else {
        res.redirect('/signin');
    }
})

router.get('/profile', middleware, (req, res) => {
    if (req.user) {
        res.render('profile', {
            user: req.user
        });
    } else {
        res.redirect('/signin');
    }
})


module.exports = router;