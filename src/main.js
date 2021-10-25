require('dotenv').config();
const nodemailer = require('nodemailer');

(async function run() {
  console.log('Running report...');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.DAILY_REPORT_FROM,
    to: process.env.DAILY_REPORT_TO,
    subject: 'Daily Report',
    text: `
      Daily Report
    `,
    html: `
      <h1>Daily Report</h1>
    `,
  });

})();