const express = require('express');
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const ejs = require('ejs');
const cookieparser = require('cookie-parser');
const port = process.env.PORT || 5000

dotenv.config({
    path: './.env'
})

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


const app = express();

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({
    extended: false
}))
app.use(express.json());
app.use(cookieparser());

app.set('view engine', "ejs");

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("DATABASE CONNECTED");
    }
})


app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));



app.listen(port, () => {
    console.log("server is running");
})