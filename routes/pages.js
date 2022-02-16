const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('Homepage');
});
 
router.get('/signin', (req, res) => {
    res.render('Signin', {message: ''});
})

router.get('/signup', (req, res) => {
    res.render('Signup', { message: '' });
})


module.exports = router;