const mysql = require('mysql');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});



exports.forumpost = (req, res) => {

    const { description } = req.body;
    db.query("SELECT description FROM forumposts WHERE forumposts = ?", [description], (err, result) => {
        db.query('INSERT INTO forumposts SET ?', { description: description }, (err, results) => {

            res.render('forumposts', {
                forumposts: results
            })

        })

    })

}
