const express = require('express');
const authController = require('../controllers/auth')

const router = express.Router();

router.post('/signup', authController.signup);

router.post('/signin', authController.signin);

router.get('/signout', authController.signout);



module.exports = router; 