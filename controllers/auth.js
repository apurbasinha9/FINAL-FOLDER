
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).render('Signin', {
                message: 'Please provide an email and password'
            })
        }
        db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
            console.log(results);
            if (err) {
                console.log(err);
            }
            if (!results || (await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('Signin', {
                    message: 'Email or Password is incorrect.'
                })
            } else {
                const id = results[0].id;

                console.log(process.env.JWT_EXPIRES_IN)
                console.log("print stuff")
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("the token is: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 100
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.redirect("/foodproducersforum")
            }
        })

    } catch (error) {
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
                res.redirect('/foodproducersforum')
            }
        });


    });


}

exports.isLoggedIn = async (req, res, next) => {

    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);

            db.query('SELECT * FROM user WHERE id = ?', [decoded.id], (err, results) => {
                console.log(results);

                if (!results) {
                    return next();
                }

                req.user = results[0];
                return next();
            });
        } catch (err) {
            console.log(err);
            return next();
        }
    } else {
        next();
    }

}

exports.signout = async (req, res) => {
    res.cookie('jwt', 'signout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });

    res.status(200).redirect('/');
}
