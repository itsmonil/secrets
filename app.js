const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const encrypt = require('mongoose-encryption');
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/secrets', { useNewUrlParser: true });
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });
const User = new mongoose.model('User', userSchema);

app.get('/', function (req, res) {
    res.render('home');
});

app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then(foundUser => {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render('secrets');
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/register', function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()
        .then(() => {
            res.render('secrets');
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.listen(3000, function () {
    console.log('Server is running on port 3000');
});