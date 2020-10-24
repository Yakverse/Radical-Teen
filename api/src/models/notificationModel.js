const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        required: true
    }, 
    text: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        required: false,
        default: false
    }
})

module.exports = schema