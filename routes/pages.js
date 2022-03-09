const express = require('express');
const authController = require('../controllers/auth');
const middleware = authController.isLoggedIn;
const mysql = require('mysql');

const router = express.Router();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.get('/', (req, res) => {
    res.render('Homepage');
});

router.get('/signin', (req, res) => {
    res.render('Signin', { message: '' });
})

router.get('/signup', (req, res) => {
    res.render('Signup', { message: '' });
})

router.get('/categories', middleware, (req, res) => {

    if (req.user) {
        db.query('SELECT * FROM categories ORDER BY name ASC', async (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                console.log("no results")
            }

            res.render('visual', {
                categories: results
            });
        })

    } else {
        res.redirect('/signin');
    }
})

router.get('/categories/:id', middleware, (req, res) => {
    // console.log(req.params.id);
    if (req.user) {
        db.query('SELECT * FROM categories WHERE id = ?', [req.params.id], async (err, category_result) => {
            if (err) {
                console.log(err);
            }
            if (!category_result) {
                console.log("no results")
            }


            db.query(`SELECT forumposts.*, user.first_name, user.last_name 
            FROM forumposts
            JOIN user
            ON forumposts.user_id = user.id
            WHERE category_id = ?`, [req.params.id], async (err, post_results) => {
                if (err) {
                    console.log(err);
                }
                if (!post_results) {
                    console.log("no post_results")
                }

                console.log(post_results)

                res.render('category_view', {
                    category: category_result[0],
                    posts: post_results,
                });
            })


            console.log(results);
        })

    } else {
        res.redirect('/signin');
    }

})



router.get('/profile', middleware, (req, res) => {
    console.log(req.user.id);
    if (req.user) {
        res.render('profile', {
            user: req.user
        });
    } else {
        res.redirect('/signin');
    }
})


module.exports = router;