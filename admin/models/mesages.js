const mongoose = require('mongoose')

const mesageSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true,
    },
    usuariop:{
        type: Number,
        required: true,
    },
    usuariot:{
        type: Number,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Mensajes',mesageSchema)