const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationSchema = require('./notificationModel');
const profilePictureSchema = require('./profilePictureModel');

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
    emailVerificationExpires: {
        type: Date,
        required: true
    },
    passwordReset: {
        type: String,
        required: false
    },
    passwordResetExpires: {
        type: Date,
        required: false
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
    },
    notification: [notificationSchema],
    profilePicture: profilePictureSchema
});

module.exports = mongoose.model('User', schema);