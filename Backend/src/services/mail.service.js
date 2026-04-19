import nodemailer from "nodemailer";

export const sendContactEmail = async (data) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // you receive email
    subject: "New Contact Form Submission",
    html: `
      <h3>New Query Received</h3>
      <p><b>Name:</b> ${data.firstName} ${data.lastName}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Message:</b> ${data.message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};