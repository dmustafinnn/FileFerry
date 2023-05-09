const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const User = require("../models/User");

// TODO: change the apis to validate tokens

// Get all users
router.get("/", (req, res) => {
    User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json({message: err.message}));
});

// Update a user
router.patch("/:id", (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json({message: err.message}));
});

// Delete a user
router.delete("/:id", (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json({message: err.message}));
});

// Get a user's whitelist
router.get("/whitelist", authenticateToken, async (req, res) => {
    try {
        const currentUserWhitelist = await User.findById(req.user.id).populate('whitelist', 'name email').select('whitelist').catch((err) =>
            res.status(500).json({message: err.message})
        );

        res.status(200).json(currentUserWhitelist);
    } catch (err) {
        console.error(err);
        res.status(500).send({message: "Server error"});
    }
});

// Add a user to whitelist
router.post("/whitelist/add", authenticateToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id).catch((err) =>
            res.status(500).json({message: err.message})
        );

        const whiteListUser = await User.findOne({email: req.body.email}).catch(
            (err) => res.status(500).json({message: err.message})
        );

        if (!whiteListUser) {
            return res.status(404).send({message: "User not found"});
        }


        // Add user to the whitelist if they are not already on it
        if (!currentUser.whitelist.includes(whiteListUser._id)) {
            currentUser.whitelist.push(whiteListUser._id);
            console.log(currentUser.whitelist.includes(whiteListUser._id))
            await currentUser.save();
        } else {
            return res.status(409).send({message: "User already in whitelist"});
        }

        const updatedUser = await User.findById(req.user.id).populate('whitelist', 'name email').select('whitelist').catch((err) =>
            res.status(500).json({message: err.message})
        );

        res.status(200).json({success: true, user: updatedUser});
    } catch (err) {
        console.error(err);
        res.status(500).send({message: "Server error"});
    }
});

// Delete a user from whitelist
router.post("/whitelist/delete", authenticateToken, async (req, res) => {
    try {
        let data = req.body.emails ? req.body.emails : req.body.ids;
        let type = req.body.emails ? "email" : "_id";
        const currentUser = await User.findById(req.user.id).select("whitelist").catch((err) =>
            res.status(500).json({message: err.message})
        );
        for (let index in data) {
            let whiteListUser;
            if (type === "email") {
                whiteListUser = await User.findOne({email: data[index]}).catch(
                    (err) => res.status(500).json({message: err.message})
                );
            } else {
                whiteListUser = await User.findOne({_id: data[index]}).select("_id").catch(
                    (err) => res.status(500).json({message: err.message})
                );
            }

            // Delete user from whitelist if they are already on it
            if (currentUser.whitelist.includes(whiteListUser._id)) {
                let i = currentUser.whitelist.indexOf(whiteListUser._id);
                if (index !== -1) {
                    currentUser.whitelist.splice(i, 1);
                }
            } else {
                return res.status(404).send({message: "User not in whitelist"});
            }
        }
        await currentUser.save();

        const updatedUser = await User.findById(req.user.id).populate('whitelist', 'name email').select('whitelist').catch((err) =>
            res.status(500).json({message: err.message})
        );

        res.status(200).json({success: true, user: updatedUser});
    } catch (err) {
        console.error(err);
        res.status(500).send({message: "Server error"});
    }
});

module.exports = router;
