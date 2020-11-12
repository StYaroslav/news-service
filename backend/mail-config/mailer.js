const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },
})

module.exports = {
    sendMail(from, to, subject, html) {
        return transporter.sendMail(from, to, subject, html)
    }
}