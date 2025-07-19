const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const puppeteer = require('puppeteer');
const itineraryTemplate = require('./itineraryTemplate');
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

async function createReservationPDF(ticket) {
  const leadPassenger = `${ticket.passengers[0].title} ${ticket.passengers[0].firstName} ${ticket.passengers[0].lastName}`;

  // Generate QR Code
  await QRCode.toFile(
    `public/qr-codes/${ticket.pnr}-qr.png`,
    `https://www.viewtrip.info?pnr=${ticket.pnr}`,
    { width: 100 }
  );

  // Generate Reservation PDF
  const html = itineraryTemplate(ticket);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  // Upload to reservations folder
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const pdfDir = path.join(process.cwd(), 'public', 'reservations', month);

  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  const filePath = path.join(pdfDir, `${ticket.pnr}.pdf`);
  fs.writeFileSync(filePath, pdfBuffer);

  // Send Reservation PDF to Customer
  const body = `Hi ${ticket.passengers[0].firstName}, \n\nThank you for booking your flight reservation with ViewTrip. \n\nPlease find attached your flight reservation to this email. \n\nYou can verify your reservation on https://www.viewtrip.info?pnr=${ticket.pnr}. \n\nThanks\nViewTrip`;

  await transporter.sendMail({
    from: `"ViewTrip" <${senderEmail}>`,
    to: ticket.email,
    subject: 'Your Flight Reservation',
    text: body,
    attachments: [
      {
        content: pdfBuffer,
        filename: `Flight Reservation for ${leadPassenger}.pdf`,
      },
    ],
  });

  return true;
}

module.exports = createReservationPDF;
