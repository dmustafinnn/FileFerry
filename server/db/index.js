const mongoose = require('mongoose')

// const local_db = "mongodb://ff-db:27017/";
const atlas_db = "mongodb+srv://root:root@cluster0.riwx3mf.mongodb.net/?retryWrites=true&w=majority";
mongoose
    .connect(atlas_db, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db