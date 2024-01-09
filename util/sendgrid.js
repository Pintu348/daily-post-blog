const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
// console.log(process.env.API_KEY)
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key :process.env.API_KEY
    }
}))

module.exports = transporter;