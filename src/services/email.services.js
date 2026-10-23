import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD?.replace(/\s/g, ""),
  },
}); 

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages',success);
  }
});


export const sendEmail = async (to, subject, text, html) => {
    const info = await transporter.sendMail({
        from: `"BAS bank" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    });

    console.log("Message sent:", info.messageId);
    return info;
};

export async function sendRegistrationEmai(userEmail, name) {
    const subject = "Welcome to the BAS Bank family";
    const text = `Hello ${name},\nThank you for registering at BAS Bank.`;
    const html = `
        <p>Hello ${name},</p>
        <p>My name is Vishvjeet Kumar, and I am happy to welcome you to our family.</p>
    `;

    return await sendEmail(userEmail, subject, text, html);
}
