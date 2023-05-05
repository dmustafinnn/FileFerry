const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const getDB = require('../utils/getDB');
const {ObjectId} = require("mongodb");

// Create storage engine
function upload() {
    const mongodbUrl = getDB();
    const storage = new GridFsStorage({
        url: mongodbUrl,
        file: (req, file) => {
            return new Promise((resolve, _reject) => {
                let randomFileId = new ObjectId();
                const fileInfo = {
                    _id: randomFileId,
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