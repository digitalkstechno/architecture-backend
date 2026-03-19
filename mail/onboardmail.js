import nodemailer from "nodemailer";

const LOGIN_URL = "https://architech.digitalks.co.in/login";

const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
};

export const sendTenantWelcomeMail = async ({
  email,
  userName,
  password,
}) => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Architecture SaaS Platform" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your Trial Account Is Ready",
    html: `
      <h2>Welcome 🎉</h2>
      <p>Your trial has started.</p>

      <p><b>Username:</b> ${userName}</p>
      <p><b>Password:</b> ${password}</p>

      <p>Trial valid for 7 days.</p>

      <br/>

      <a href="${LOGIN_URL}" 
         style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
         Login Now
      </a>

      <p style="margin-top:10px;">
        Or copy this link: <br/>
        <a href="${LOGIN_URL}">${LOGIN_URL}</a>
      </p>
    `,
  });
};

export const sendClientWelcomeMail = async ({
  email,
  userName,
  password,
}) => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Architecture SaaS Platform" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Dear Client, Your Account Is Ready",
    html: `
      <h2>Welcome 🎉</h2>

      <p><b>Username:</b> ${userName}</p>
      <p><b>Password:</b> ${password}</p>

      <br/>

      <a href="${LOGIN_URL}" 
         style="display:inline-block;padding:10px 20px;background:#28a745;color:#fff;text-decoration:none;border-radius:5px;">
         Login to Your Account
      </a>

      <p style="margin-top:10px;">
        Or copy this link: <br/>
        <a href="${LOGIN_URL}">${LOGIN_URL}</a>
      </p>
    `,
  });
};