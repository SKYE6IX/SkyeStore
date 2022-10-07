const nodemailer = require("nodemailer");
require('dotenv').config()


const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
});

function makeANiceEmail(text: string) {
    return `
    <divš styles="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
    ">
    <h2>Hello there!</h2>
    <p>${text}</p>
    <p>Skye Store</p>
    </divš
    `
}

export async function sendPasswordResetEmail(resetToken: string, to: string) {
    //email user token 
    const info = await transport.sendMail({
        to,
        from: 'skye2@mail.com',
        subject: 'Your Password Reset Token',
        html: makeANiceEmail(`Your Password Reset Token Is Here!

        <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here To Reset</a>
        `)
    })
}