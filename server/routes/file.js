const upload = require("../middleware/upload");
const express = require("express");
const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        console.log('--------Uploading--------');
        res.status(201).json({ text: "File uploaded successfully!" });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: { text: "Unable to upload the file", error },
        });
    }
});

module.exports = router;
