
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.signin = async (req, res) => {
    try{
        const {email, password} = req.body;
        if( !email || !password ){
            return res.status(400).render('Signin', {
                message: 'Please provide an email and password'
            })
        }
        db.query('SELECT * FROM user email = ?', [email], async (err,results) => {
            console.log(results);
            if( !results || (await bcrypt.compare(password, results[0].password))){
                res.status(401).render('Signin', {
                    message: 'Email or Password is incorrect.'
                })
            }
        })

    }catch(error){
        console.log(error);
    }
    
}

exports.signup = (req, res) => {
    console.log(req.body);

    const { firstN, lastN, email, password, verifyPassword } = req.body

    db.query('SELECT email FROM user WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
        } else if (results.length > 0) {
            return res.render('Signup', { message: 'email is taken' })
        } else if (password !== verifyPassword) {
            return res.render('Signup', { message: 'password dont match' })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO user SET ?', { first_name: firstN, last_name: lastN, email: email, password: hashedPassword }, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                console.log(results);
                return res.render('Signup', {
                    message: 'user registered'
                });
            }
        });


    });


}