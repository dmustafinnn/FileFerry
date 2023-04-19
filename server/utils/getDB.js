const getDB = () => {
	const local_db = "mongodb://ff-db:27017/fileferry";
    const db_url = local_db || process.env.ATLAS_DB;

    return db_url;
}

module.exports = getDB;