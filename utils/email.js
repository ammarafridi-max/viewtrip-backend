const nodemailer = require('nodemailer');

const senderEmail = process.env.SENDER_EMAIL;
const senderPassword = process.env.SENDER_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: senderEmail,
    pass: senderPassword,
  },
});

exports.sendEmailWithReservation = async (
  to,
  subject,
  text,
  pdfBuffer,
  filename
) => {
  const mailOptions = {
    from: `"ViewTrip" <${process.env.SENDER_EMAIL}>`,
    to,
    subject,
    text,
    attachments: [
      {
        filename,
        content: pdfBuffer,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
