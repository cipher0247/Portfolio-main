# EmailJS Setup Guide

## Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Click **Sign Up** and create a free account
3. Verify your email

## Step 2: Add Gmail (or your email service)
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add Service**
3. Select **Gmail** (or your email provider)
4. Connect your email account
5. Copy the **Service ID** (e.g., `service_xxxxx`)

## Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Set the name to: `contact_form`
4. In the template editor, set the email recipient to your address: `{{from_email}}`
5. Use this template code:

```
To: sivashankarraju12@gmail.com
Subject: {{subject}}
From: {{from_name}} <{{from_email}}>

Name: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}
```

6. Copy the **Template ID** (e.g., `template_xxxxx`)

## Step 4: Get Your Public Key
1. In EmailJS dashboard, go to **Account** (top right)
2. Copy your **Public Key** (e.g., `abc123def456...`)

## Step 5: Update Your Code
Edit `assets/js/script.js` and replace:

```javascript
emailjs.init('YOUR_PUBLIC_KEY'); // Line ~307
emailjs.send('SERVICE_ID', 'TEMPLATE_ID', { // Line ~330
```

With your actual IDs:

```javascript
emailjs.init('abc123def456xyz'); // Your Public Key
emailjs.send('service_xxxxx', 'template_contact_form', {
```

## Step 6: Test It!
1. Open your portfolio in a browser
2. Fill the contact form
3. Click "Send Me Message"
4. You should receive the email in seconds!

## Troubleshooting

**"Message could not send" error:**
- Check browser console (F12 > Console tab) for detailed errors
- Verify all three IDs are correct
- Make sure Gmail account is connected in EmailJS
- Check that you're using the correct template variable names (from_name, from_email, subject, message)

**Email not arriving:**
- Check spam folder
- Re-verify your email in EmailJS dashboard
- Try with a different email template format

**Free Tier Limits:**
- 200 emails/month (free plan)
- Unlimited for paid plans (~$12/month)
- Perfect for portfolio websites!

---

**Questions?** Visit https://www.emailjs.com/docs/
