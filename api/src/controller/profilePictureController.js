import mongoose from 'mongoose';
import aws from 'aws-sdk';
const User = mongoose.model('User');
const s3 = new aws.S3()

exports.savePicture = async (req, res) => {

    // header = {sessionID: ''}
    // form-data = {
    //     file: base64 file
    // }

    const { originalname: name, size, key, location: url } = req.file;

    User.findById(req.cookies['sessionID']).then(data => {
        if (data == null || Object.keys(data).length == 0) {
            s3.deleteObject({
                Bucket: process.env.BUCKET_NAME,
                Key: key
            }).promise()
            res.clearCookie('sessionID', { path: '/' })
            return res.status(404).send({ code: 404, sucess: false })
        }

        if (data.profilePicture){
            s3.deleteObject({
                Bucket: process.env.BUCKET_NAME,
                Key: data.profilePicture.key
            }).promise()
        }

        data.profilePicture = { name, size, key, url }
        User.replaceOne({ _id: req.cookies['sessionID'] }, data).then(() => {
            return res.status(200).send({ code: 200, sucess: true })
        }).catch(() => {
            return res.status(500).send({ code: 500, sucess: false })
        })
    }).catch(() => {
        res.clearCookie('sessionID', { path: '/' })
        return res.status(400).send({ code: 400, sucess: false })
    })
}

exports.deletePicture = async (req, res) => {

    // header = {sessionID: ''}

    User.findById(req.cookies['sessionID']).then(data => {
        if (data == null || Object.keys(data).length == 0) {
            res.clearCookie('sessionID', { path: '/' })
            return res.status(404).send({ code: 404, sucess: false })
        }

        if(data.profilePicture) {
            s3.deleteObject({
                Bucket: process.env.BUCKET_NAME,
                Key: data.profilePicture.key
            }).promise()
            data.profilePicture = undefined
            User.replaceOne({ _id: req.cookies['sessionID'] }, data).then(() => {
                return res.status(200).send()
            }).catch(() => {
                return res.status(500).send()
            })
        } else return res.status(304).send()       
    }).catch(() => {
        res.clearCookie('sessionID', { path: '/' })
        return res.status(400).send({ code: 400, sucess: false })
    })
}