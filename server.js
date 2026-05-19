const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const EMAIL_TO = process.env.EMAIL_TO || 'sivashankarraju12@gmail.com';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER || 'your-email@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'your-email-password';
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';

if (SMTP_USER === 'your-email@gmail.com' || SMTP_PASS === 'your-email-password') {
  console.warn('Warning: SMTP_USER and SMTP_PASS are not configured. Update server.js or set environment variables for Nodemailer.');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

app.post('/sendmail', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const mailOptions = {
    from: `${name} <${SMTP_USER}>`,
    to: EMAIL_TO,
    replyTo: email,
    subject: `Portfolio Contact: ${subject}`,
    html: `
      <h2>New contact form message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  if (SMTP_USER === 'your-email@gmail.com' || SMTP_PASS === 'your-email-password') {
    return res.status(500).json({
      success: false,
      message: 'SMTP credentials are not configured. Set SMTP_USER and SMTP_PASS in environment variables or server.js.'
    });
  }

  try {
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Nodemailer error:', error);
    const message = error.code === 'EAUTH'
      ? 'SMTP authentication failed. Check your SMTP username/password and use a Gmail App Password if using Gmail.'
      : error.message || 'Failed to send email. Check server logs for details.';
    return res.status(500).json({ success: false, message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
