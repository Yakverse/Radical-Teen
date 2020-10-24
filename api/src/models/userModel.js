const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    nome: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        required: false,
        default: false
    },
    emailVerification: {
        type: String,
        required: false,
        default: ''
    },
    cel: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: false,
        default: false
    },
    userFortnite: {
        type: String,
        required: false
    },
    userRL: {
        type: String,
        required: false
    },
    userFifa: {
        type: String,
        required: false
    },
    userLol: {
        type: String,
        required: false
    },
    userFF: {
        type: String,
        required: false
    },
    userSteam: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('User', schema);