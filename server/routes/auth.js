const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Registration route
router.post("/register", (req, res) => {
	const { username, email, password } = req.body;

	// Hash the password before saving it
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(password, salt, (err, hash) => {
			if (err) throw err;
			const newUser = new User({
				username,
				email,
				password: hash,
			});
			newUser
				.save()
				.then((user) => res.status(201).json(user))
				.catch((err) => res.status(500).json({ message: err.message }));
		});
	});
});

// Login route
router.post("/login", passport.authenticate("local"), (req, res) => {
	const token = generateToken(req.user);

	res.status(200).json({ ...req.user, success: true, token: token });
});

router.get("/", (req, res) => {
	res.status(200).json({ test: "test" });
});

// TODO: change the apis to validate tokens like the below example
// const authenticateToken = require('./middleware/authenticateToken');
// router.get('/data', authenticateToken, (req, res) => {
//   const data = 'This is some protected data!';
//   res.send(data);
// });

module.exports = router;
