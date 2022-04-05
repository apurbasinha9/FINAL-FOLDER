const mysql = require('mysql');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});



exports.forumpost = (req, res) => {

    const { description, title, subCategory } = req.body;
    const category_id = req.params.id;
    const user_id = req.user.id;
    // console.log("sub category id: ", subCategory);
    db.query('INSERT INTO forumposts SET ?', { subcategory_id: subCategory, title: title, description: description, category_id: category_id, user_id: user_id }, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/categories/' + req.params.id)
    })
}


