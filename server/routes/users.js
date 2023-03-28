const express = require('express');
const router = express.Router();

const User = require('../models/User');

// Get all users
router.get('/', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Get a single user
router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Update a user
router.patch('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(user => res.json(user))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Delete a user
router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;