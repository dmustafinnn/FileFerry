const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Registration route
router.post("/register", (req, res) => {
	const { username, name, email, password } = req.body;
	
	// Hash the password before saving it
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(password, salt, (err, hash) => {
			if (err) throw err;
			const newUser = new User({
				username,
				name,
				email,
				password: hash,
			});
			newUser
				.save()
				.then((user) => res.status(201).json(user))
				.catch((err) => res.status(500).json({ error: err.message }));
		});
	});
});

// Login route
router.post("/login", passport.authenticate("local"), (req, res) => {
	const token = generateToken(req.user);

	res.status(200).json({ ...req.user, success: true, token: token });
});


module.exports = router;


router.get("/", (req, res) => {
	res.status(200).json({ test: "test" });
});

module.exports = router;
