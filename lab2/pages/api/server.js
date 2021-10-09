import isEmail from "../../src/checkEmail";
import sanitizeHtml from "sanitize-html";

const nodemailer = require("nodemailer");
const rateLimit = require("lambda-rate-limiter")({
  interval: 60 * 1000,
}).check;

export default async function handler(req, res) {
  try {
    await rateLimit(2, req.headers["x-forwarded-for"]); //[0]
  } catch (error) {
    res.status(429).json({ message: "Too many requests!" });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "lilly.nader5@ethereal.email",
      pass: process.env.mail_password,
    },
  });

  for (let key in req.body) {
    if (!req.body[key]) {
      return res
        .status(500)
        .json({ message: "No one field shouldn't be empty!" });
    }
  }

  if (!isEmail(req.body.from) || !isEmail(req.body.where)) {
    return res.status(500).json({ message: "Enter correct email, pls." });
  }

  const clearHtml = sanitizeHtml(req.body.letter);
  if (!clearHtml) {
    return res.status(500).json({ message: "Enter safe information!" });
  }

  const bodyToSend = {
    from: req.body.from,
    to: req.body.where,
    subject: "Subject",
    text: req.body.letter,
    html: clearHtml,
  };

  try {
    let info = await transporter.sendMail(bodyToSend);
  } catch (error) {
    return res.status(500).json({ message: "Connect to mailer failed!" });
  }
  return res.status(200).json({ message: "Mail sent!" });
}
