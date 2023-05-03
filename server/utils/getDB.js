const getDB = () => {
	const local_db = "mongodb://ff-db:27017/fileferry";
    return local_db || process.env.ATLAS_DB;
}

module.exports = getDB;