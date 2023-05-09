const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const File = require("../models/File");
const { Permission } = require("../models/Permission");
const User = require("../models/User");
const auth = require("../middleware/authenticateToken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// nodemailer transporter for sending emails
// TODO: These are temporary credentials. Change them to FileFerry's official account
const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: "talon.swift2@ethereal.email",
		pass: "9R7NF8BUA1BDWSmXKJ",
	},
});

// Use the following for debugging emails
// const transporter = nodemailer.createTransport({
//     host: 'localhost',
//     port: 1025,
//     auth: {
//         user: 'project.1',
//         pass: 'secret.1'
//     }
// });

// Upload a file
router.post("/upload", auth, upload.single("file"), async (req, res) => {
	try {
		const fileId = req.file.id;
		const file = new File({
			fileBucketId: fileId,
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
		const userFiles = await User.findById(req.user.id, "permissions")
			.where("permissions.status")
			.in(["own", "accepted"])
			.populate("permissions.fileId", "filename createdAt length")
			.populate("permissions.userId", "username")
			.catch((err) => res.status(500).json({ message: err.message }));
		const files = userFiles?.permissions;
		res.json({ files });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: err.message });
	}
});

// Share a file with another user
router.post("/:id/share", auth, async (req, res) => {
	try {

		const file = await File.findById(req.params.id).populate("user", "email");

		if (!file) {
			return res.status(404).json({ message: "File not found" });
		}
		if (file.user._id.toString() !== req.user.id) {
			return res
				.status(401)
				.json({ message: "You do not have permission to share this file" });
		}

		const recipient = await User.findOne({ email: req.body.email });
		if (!recipient) {
			console.log("Recipient Not found")
			return res.status(404).json({ message: "Recipient not found" });
		}
		const existingPermission = await Permission.findOne({
			sharedUserId: recipient._id,
			fileId: file._id,
		});

		if (existingPermission) {
			return res
				.status(400)
				.json({ message: "File already shared with this user" });
		}

		// sender is registered as a whitelisted user
		if (recipient?.whitelist.includes(file.user._id)){
			const permission = new Permission({
				sharedUserId: recipient._id,
				fileId: file._id,
				userId: file.user._id,
				status: "accepted",
			});
			await permission.save();

			await User.findByIdAndUpdate(permission.sharedUserId._id.toString(), {
				$push: {
					permissions: permission,
				},
			});

			res.json({ message: "File shared successfully" });
		}

		const token = crypto.randomBytes(20).toString("hex");
		const permission = new Permission({
			sharedUserId: recipient._id,
			fileId: file._id,
			userId: file.user._id,
			token: token,
			status: "pending",
		});
		await permission.save();

		const url = `http://localhost:5000/file/${file._id}/permissions/${permission._id}/accept?token=${token}`;
		const mailOptions = {
			from: "talon.swift2@ethereal.email",
			to: recipient.email,
			subject: `You have been invited to access file ${file.filename}`,
			html: `
          <p>You have been invited by ${file.user.email} to access file ${file.filename}.</p>
          <p>Please click the following link to accept the invitation:</p>
          <p><a href="${url}">${url}</a></p>
        `,
		};
		await transporter.sendMail(mailOptions);

		res.json({ message: "File shared successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

// Endpoint for accepting a shared file permission
router.get("/:fileId/permissions/:permissionId/accept", async (req, res) => {
	try {
		const permission = await Permission.findById(req.params.permissionId)
			.populate({ path: "sharedUserId", select: "email" })
			.populate({ path: "fileId", select: "filename" });

		if (!permission || permission.token !== req.query.token) {
			return res.status(404).json({ message: "Permission not found" });
		}

		permission.status = "accepted";
		await permission.save();

		await User.findByIdAndUpdate(permission.sharedUserId._id.toString(), {
			$push: {
				permissions: permission,
			},
		});

		res.send(`
            <h1>File permission accepted</h1>
            <p>You have successfully accepted permission to access file ${permission.fileId.filename}.</p>
        `);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

// search for files
router.get('/search', auth, async (req, res) => {
	try {
		const searchText = req.query.text;
		const userFiles = await User.findById(req.user.id, "permissions")
			.where("permissions.status")
			.in(["own", "accepted"])
			.populate("permissions.fileId", "filename createdAt length")
			.populate("permissions.userId", "username")
			.catch((err) => res.status(500).json({ message: err.message }));

		let files = userFiles?.permissions;

		// filter files based on search text
		if (searchText) {
			files = files.filter((file) => {
				return file.fileId.filename.includes(searchText); // modify this condition as needed
			});
		}

		res.json({ files });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
