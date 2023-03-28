const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

// Registration route
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password before saving it
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            const newUser = new User({
                username,
                email,
                password: hash
            });
            newUser.save()
                .then(user => res.status(201).json(user))
                .catch(err => res.status(500).json({ message: err.message }));
        });
    });
});

// Login route
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json(req.user);
});

router.get('/', (req, res) => {
    res.status(200).json({'test': 'test'});
})

module.exports = router;
