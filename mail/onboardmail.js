import nodemailer from "nodemailer";
export const sendTenantWelcomeMail = async ({
  email,
  userName,
  password,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Architecture SaaS Platform" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your Trial Account Is Ready",
    html: `
      <h3>Welcome 🎉</h3>
      <p>Your trial has started.</p>
      <p><b>Username:</b> ${userName}</p>
      <p><b>Password:</b> ${password}</p>
      <p>Trial valid for 7 days.</p>
    `,
  });
};
