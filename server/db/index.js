const mongoose = require('mongoose')

const local_db = "mongodb://fileferry-primary:27017,fileferry-secondary-1:27017,fileferry-secondary-2:27017/?replicaSet=dbrs";
const atlas_db = "mongodb+srv://root:root@cluster0.riwx3mf.mongodb.net/?retryWrites=true&w=majority";
mongoose
    .connect(atlas_db, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db