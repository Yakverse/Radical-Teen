const sgMail = require('@sendgrid/mail');
const settings = require('../settings');

// Set API Key from SendGrid
sgMail.setApiKey(settings.SMPTKey);

module.exports = sgMail;