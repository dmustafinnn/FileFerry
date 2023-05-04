const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const User = require("../models/User");

// TODO: change the apis to validate tokens

// Get all users
router.get("/", (req, res) => {
	User.find()
		.then((users) => res.json(users))
		.catch((err) => res.status(500).json({ message: err.message }));
});

// // Get a single user
// router.get("/:id", (req, res) => {
// 	User.findById(req.params.id)
// 		.then((user) => res.json(user))
// 		.catch((err) => res.status(500).json({ message: err.message }));
// });

// Update a user
router.patch("/:id", (req, res) => {
	User.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then((user) => res.json(user))
		.catch((err) => res.status(500).json({ message: err.message }));
});

// Delete a user
router.delete("/:id", (req, res) => {
	User.findByIdAndDelete(req.params.id)
		.then((user) => res.json(user))
		.catch((err) => res.status(500).json({ message: err.message }));
});

// Get a user's whitelist
router.get("/whitelist", authenticateToken, async (req, res) => {
	try {
		const currentUserWhitelist = await User.findById(req.user.id).populate('whitelist', 'name email').select('whitelist').catch((err) =>
			res.status(500).json({ message: err.message })
		);

		res.status(200).json(currentUserWhitelist);
	} catch (err) {
		console.error(err);
		res.status(500).send({ message: "Server error" });
	}
});

// Add a user to whitelist
router.post("/addwhitelist", authenticateToken, async (req, res) => {
	try {
		const currentUser = await User.findById(req.user.id).catch((err) =>
			res.status(500).json({ message: err.message })
		);
		const whiteListUser = await User.findOne({ email: req.body.email }).catch(
			(err) => res.status(500).json({ message: err.message })
		);

		if (!whiteListUser) {
			return res.status(404).send({ message: "User not found" });
		}

		// Add user to the whitelist if they are not already on it
		if (!currentUser.whitelist.includes(whiteListUser._id)) {
			currentUser.whitelist.push(whiteListUser._id);
			await currentUser.save();
		}

		const updatedUser = await User.findById(req.user.id, "whitelist").catch((err) =>
			res.status(500).json({ message: err.message })
		);

		res.status(200).json({ success: true, user: updatedUser });
		// res.status(200).json({ success: true });
	} catch (err) {
		console.error(err);
		res.status(500).send({ message: "Server error" });
	}
});

// Delete a user from whitelist
router.post("/deletewhitelist", authenticateToken, async (req, res) => {
	try {
		const currentUser = await User.findById(req.user.id).catch((err) =>
			res.status(500).json({ message: err.message })
		);
		const whiteListUser = await User.findOne({ email: req.body.email }).catch(
			(err) => res.status(500).json({ message: err.message })
		);

		if (!whiteListUser) {
			return res.status(404).send({ message: "User not found" });
		}

		// Add user to the whitelist if they are not already on it
		if (currentUser.whitelist.includes(whiteListUser._id)) {
			currentUser.whitelist.pop(whiteListUser._id);
			await currentUser.save();
		}

		const updatedUser = await User.findById(req.user.id, "whitelist").catch((err) =>
			res.status(500).json({ message: err.message })
		);

		res.status(200).json({ success: true, user: updatedUser });
	} catch (err) {
		console.error(err);
		res.status(500).send({ message: "Server error" });
	}
});

module.exports = router;
