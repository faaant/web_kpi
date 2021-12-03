import isEmail from "../../src/checkEmail";
import sanitizeHtml from "sanitize-html";

const nodemailer = require("nodemailer");
const rateLimit = require("lambda-rate-limiter")({
  interval: 60 * 1000,
}).check;

export default async function handler(req, res) {
  const clientIP =
    (req.headers["x-forwarded-for"] || "").split(",")?.pop()?.trim() ||
    req.socket.remoteAddress;
  try {
    await rateLimit(2, clientIP);
  } catch (error) {
    return res.status(429).json({
      source: {
        error: error,
      },
      meta: {
        data: {
          message: "Too many requests!",
        },
      },
    });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  if (Array.from(req.body).some((el) => el === null)) {
    return res.status(400).json({
      status: "400",
      meta: {
        data: {
          message: "No one field shouldn't be empty!",
        },
      },
    });
  }

  if (!isEmail(req.body.email)) {
    return res.status(400).json({
      meta: {
        data: {
          message: "Enter correct e-mail, pls.",
        },
      },
    });
  }

  const clearHtml = sanitizeHtml(
    "Email:" + req.body.email + "<br/>" + req.body.letter
  );
  if (!clearHtml) {
    return res.status(400).json({
      meta: {
        data: {
          message: "Enter safe information!",
        },
      },
    });
  }

  const bodyToSend = {
    from: process.env.MAIL,
    to: process.env.MAIL_TO,
    subject: "Subject",
    text: req.body.letter,
    html: clearHtml,
  };

  try {
    let info = await transporter.sendMail(bodyToSend);
  } catch (error) {
    return res.status(500).json({
      source: {
        error: error,
      },
      meta: {
        data: {
          message: "Connect to mailer failed!",
        },
      },
    });
  }
  return res.status(200).json({
    meta: {
      data: {
        message: "Mail sent!",
      },
    },
  });
}
