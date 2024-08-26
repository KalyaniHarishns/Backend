
const nodemailer = require('nodemailer');

// Configure the email transporter (e.g., using Gmail)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

// Controller functions
const forgotPassword = (req, res) => {
  const { email } = req.body;

  // In a real application, you would look up the user and generate a password reset token
  // For simplicity, we're just sending a generic email

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Password Reset Instructions',
    text: 'Please click the link below to reset your password: [reset link]'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send reset instructions' });
    }
    res.json({ message: 'Password reset instructions have been sent to your email' });
  });
};

module.exports = {
  forgotPassword
};
