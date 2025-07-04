// utils/sendEmail.js
import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, text }) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "freelancer.hub.nextgen@gmail.com", // your email
            pass: "niuqhrvoyeumqtrz", // app password
        },
    });

    const mailOptions = {
        from: "freelancer.hub.nextgen@gmail.com",
        to,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);
}
