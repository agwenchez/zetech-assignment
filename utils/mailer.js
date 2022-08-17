const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.password
    }
});


const sendMail = async (firstname, lastname, email, subject, header, body) => {
    try {

        return await transporter.sendMail(
            {
                from: 'Afya Kwanza',
                to: email,
                subject: `${subject}`,
                html: ` <p>Dear ${firstname} ${lastname}, <br>
                       ${header} <br>
                       ${body}<br>
                       You can login <strong><a href='https://demos.mediapal.net/afya/sacco-admin'>here</a></strong> <br>
                       Kindly login from a desktop or laptop, Thank you.
                       </p>`
            },

            (error, info) => {
                if (!error) {
                    console.log('Email has been sent successfully')
                }

                console.log(error);
            });
    } catch (error) {
        return console.log(`An error occured:${error}`)
    }
}


const sendMailAttachment = async (email, filename, path, text, subject) => {
    try {

        return await transporter.sendMail(
            {
                from: 'Afya Kwanza',
                to: email,
                subject: subject,
                html: ` Dear Sir/Madam, <br> ${text}`,
                attachments: [
                    {
                        filename: `${filename}`,
                        path: `${path}`
                    }
                ]
            },

            (error, info) => {
                if (!error) {
                    console.log('Email has been sent successfully')
                }

                console.log(error);
            });
    } catch (error) {
        return console.log(`An error occured:${error}`)
    }
}
module.exports = { sendMail, sendMailAttachment }