import sanitizeHtml from "sanitize-html";
const nodemailer = require("nodemailer");

const rateLimit = require("lambda-rate-limiter")({
  interval: 60 * 1000,
}).check;

export default async function handler(req, res) {
  try {
    await rateLimit(2, req.headers["client-ip"]);
  } catch (error) {
    res.status(429).json(error);
  }
  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "lilly.nader5@ethereal.email",
      pass: "x9dVcEyxFRGpYudn1s",
    },
  });

  let info = await transporter.sendMail({
    from: req.body.from, // sender address
    to: req.body.where, // list of receivers
    subject: "No subject", // Subject line
    text: sanitizeHtml(req.body.letter), // plain text body
    html: sanitizeHtml(req.body.letter), // html body
  });
  res.status(200).json({});
}
