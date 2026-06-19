const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  // Load configuration from environment variables
  const EMAIL_TO = process.env.EMAIL_TO || 'sivashankarraju12@gmail.com';
  const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
  const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const SMTP_SECURE = process.env.SMTP_SECURE === 'true';

  if (!SMTP_USER || !SMTP_PASS) {
    console.error('SMTP credentials are not configured in environment variables.');
    return res.status(500).json({
      success: false,
      message: 'Server mail configuration error. Please ensure SMTP_USER and SMTP_PASS environment variables are configured on Vercel.'
    });
  }

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

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

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Nodemailer error:', error);
    const errorMsg = error.code === 'EAUTH'
      ? 'SMTP authentication failed. Check your SMTP username/password and use a Gmail App Password if using Gmail.'
      : error.message || 'Failed to send email. Check server logs for details.';
    return res.status(500).json({ success: false, message: errorMsg });
  }
};
