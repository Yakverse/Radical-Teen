const config = require('dotenv/config')
const SES = require('aws-sdk/clients/ses')

const client = new SES({
    region: 'sa-east-1'
});

module.exports = client;