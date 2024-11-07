"use server";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL, // Your Gmail address
    pass: process.env.GMAIL_PASSWORD, // App-specific password or Gmail password
  },
});

export default async function sendEmail(recipientEmail: string, sendingName: string, subject: string, message: string) {
  if (!recipientEmail || !subject || !message) {
    throw new Error("Please provide all required fields.");
  }

  console.log(process.env.GMAIL_EMAIL, process.env.GMAIL_PASSWORD);

  try {
    await transporter.sendMail({
      from: sendingName,
      to: recipientEmail,
      subject,
      html: message,
    });

    return { message: 'Email sent successfully' };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
}
