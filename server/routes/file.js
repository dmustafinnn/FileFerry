const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const File = require("../models/File");
const { Permission } = require("../models/Permission");
const User = require("../models/User");
const auth = require("../middleware/authenticateToken");

// Upload a file
router.post("/upload", auth, upload.single("file"), async (req, res) => {
    try {
        const file = new File({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            length: req.file.size,
            user: req.user.id,
        });
        await file.save();

        const permission = new Permission({
            userId: req.user.id,
            fileId: file._id,
            status: "own",
        });
        await permission.save();

        await User.findByIdAndUpdate(req.user.id, {
            $push: {
                permissions: permission,
            },
        });

        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
});

// Get all files of a user
router.get("/", auth, async (req, res) => {
    try {
        const userFiles = await User.findById(req.user.id)
            .where("permissions.status")
            .in(["own", "accepted"])
            .catch((err) => res.status(500).json({ message: err.message }));
        const files = userFiles?.permissions;
        const fileDetails = [];
        for (let i in files) {
            let fileDetail = await File.findById(files[i].fileId);
            fileDetails.push({
                filename: fileDetail.filename,
                length: fileDetail.length,
                owner: await User.findById(
                    fileDetail.user.toString(),
                    "username email"
                ),
                status: files[i].status,
                fileId: fileDetail._id,
            });
        }
        res.json({ fileDetails });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
