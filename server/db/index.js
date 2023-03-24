const mongoose = require('mongoose')

const local_db = "mongodb://ff-mongo:27017/";
// const atlas_db = "mongodb+srv://root:root@cluster0.riwx3mf.mongodb.net/?retryWrites=true&w=majority";
mongoose
    .connect(local_db, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db