const mongoose = require('mongoose')

mongoose
    .connect('mongodb://fileferry-primary:27017,fileferry-secondary-1:27017,fileferry-secondary-2:27017/?replicaSet=dbrs', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db