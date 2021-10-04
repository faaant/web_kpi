const nodemailer = require("nodemailer");
const rateLimit = require("lambda-rate-limiter")({
  interval: 60 * 1000,
}).check;

export default async function handler(req, res) {
  try {
    await rateLimit(100, req.headers["x-forwarded-for"][0]);
  } catch (error) {
    res.status(429).json({ message: "Too many requests!" });
    return;
  }
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "lilly.nader5@ethereal.email",
      pass: "x9dVcEyxFRGpYudn1s",
    },
  });
  const bodyToSend = {
    from: req.body.from, // sender address
    to: req.body.where, // recipient
    subject: "Subject", // Subject line
    text: req.body.letter, // plain text body
    html: req.body.letter, // html body
  };

  try {
    fetch("http://localhost:3000/api/checking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyToSend),
    })
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        bodyToSend = {
          from: data.from, // sender address
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.html, // html body
        };
      });
  } catch (error) {
    return res.status(500).json({ message: "Request failed" });
  }
  try {
    let info = await transporter.sendMail({
      from: bodyToSend.from, // sender address
      to: bodyToSend.to, // list of receivers
      subject: bodyToSend.subject, // Subject line
      text: bodyToSend.text, // plain text body
      html: bodyToSend.html, // html body
    });
  } catch (error) {
    return res.status(500).json({ message: "Connect to mailer failed!" });
  }
  return res.status(200).json({ message: "Mail sent!" });
}
