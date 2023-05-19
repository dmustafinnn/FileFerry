const getDB = () => {
	const local_db = "mongodb://ff-db:27017/fileferry";
    return process.env.ATLAS_DB || local_db;
}

module.exports = getDB;