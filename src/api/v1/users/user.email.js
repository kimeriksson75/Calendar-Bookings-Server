const nodemailer = require('nodemailer');
const logger = require("pino")();
const {
    NODE_MAILER_SERVICE,
    NODE_MAILER_PORT,
    NODE_MAILER_USER,
    NODE_MAILER_PASS,
    NODE_MAILER_FROM
} = require('../../../config');

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: NODE_MAILER_SERVICE,
            port: NODE_MAILER_PORT,
            auth: {
                user: NODE_MAILER_USER,
                pass: NODE_MAILER_PASS
            }
        });

        await transporter.sendMail({
            from: NODE_MAILER_FROM,
            to: email,
            subject,
            text
        });
        logger.info(`Email sent successfully to ${email}`);
    } catch (error) {
        logger.error(`Error while sending email: ${error}`);
    }
}

module.exports = {
    sendEmail,
};