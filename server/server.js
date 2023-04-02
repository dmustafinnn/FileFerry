const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs');
var cors = require('cors')
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/User');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Set up app
const app = express();

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

// Set up Passport
passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username })
        .then(user => {
            if (!user) return done(null, false, { message: 'Incorrect username.' });
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

// Set up routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Connect to MongoDB
const local_db = "mongodb://ff-db:27017/fileferry";
const db_url = local_db || process.env.ATLAS_DB;
mongoose
    .connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        // Start server
        app.listen(5000, () => {
            console.log('Server started on port 5000');
            console.log(`URL: ${db_url}`);
        });
    })
    .catch(e => {
        console.error('Connection error', e.message)
    });