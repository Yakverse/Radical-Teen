const mongoose = require("mongoose");
const aws = require("aws-sdk");

const s3 = new aws.S3();

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

module.exports = schema