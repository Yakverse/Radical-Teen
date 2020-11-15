import sharp from 'sharp';
import aws from 'aws-sdk';
import { basename, extname } from 'path';
const s3 = new aws.S3();

export default {
    key: 'CompressImage',
    options: {},
    async handle({ data }) {
        const image = await s3.getObject({
            Bucket: process.env.BUCKET_NAME,
            Key: data.key
        }).promise()

        s3.deleteObject({
            Bucket: process.env.BUCKET_NAME,
            Key: data.key
        }).promise()

        const compressed = await sharp(image.Body)
            .resize(1280, 720, { fit: 'inside', withoutEnlargement: true })
            .toFormat('jpeg', { progressive: true, quality: 50 })
            .toBuffer()

        await s3.putObject({
            ACL:'public-read',
            Body: compressed,
            Bucket: process.env.BUCKET_NAME,
            ContentType: `image/jpeg`,
            Key: `${basename(data.key, extname(data.key))}.jpeg`
        }).promise()
    }
}