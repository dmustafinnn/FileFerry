const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs');
var cors = require('cors')
const LocalStrategy = require('passport-local').Strategy;
const connection = require("./db/index");

connection();

let bucket;
(() => {
    mongoose.connection.on("connected", () => {
        console.log('Creating bucket');
        bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "filesBucket",
        });
    });
})();

// Set up app
const app = express();

// Start server
app.listen(5000, () => {
    console.log('Server started on port 5000');
});

// Data models
const User = require('./models/User');

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Set up cors
var corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}

app.options('*', cors(corsOptions))

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const fileRoutes = require('./routes/file');

// Set up routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/file', fileRoutes);

// Set up Passport
passport.use(new LocalStrategy((email, password, done) => {
    User.findOne({ email })
        .then(user => {
            if (!user) return done(null, false, { message: 'Incorrect email.' });
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) throw err;
                if (res) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            });
        })
        .catch(err => done(err));
}));
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err));
});