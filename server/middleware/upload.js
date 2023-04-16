const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const getDB = require('../utils/getDB');

// Create storage engine
function upload() {
    const mongodbUrl = getDB();
    const storage = new GridFsStorage({
        url: mongodbUrl,
        file: (req, file) => {
            return new Promise((resolve, _reject) => {
                const fileInfo = {
                    filename: file.originalname,
                    bucketName: "filesBucket",
                };
                resolve(fileInfo);
            });
        },
    });

    return multer({ storage });
}

module.exports = upload();