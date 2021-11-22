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
    return res.json({
      id: new Date() + " rate limit" + clientIP,
      links: {
        about: error.about,
      },
      status: "429",
      code: error.code,
      title: "Too many requests",
      detail: "Human reached current rate limit.",
      source: {
        pointer: error.pointer,
        parametr: error.parametr,
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

  if (Object.values(req.body).find((el) => el === null)) {
    return res.json({
      id: new Date() + " check not null" + clientIP,
      status: "400",
      title: "Request failed, NULL key",
      detail: "All keys must have not null values.",
      meta: {
        data: {
          message: "No one field shouldn't be empty!",
        },
      },
    });
  }

  if (!isEmail(req.body.email)) {
    return res.status(500).json({
      id: new Date() + " check mail" + clientIP,
      status: "500",
      title: "Request failed, bad email",
      detail: "User enetered uncorrect e-mail.",
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
    return res.status(500).json({
      id: new Date() + " clear info" + clientIP,
      status: "500",
      title: "Request failed, unsafe info",
      detail: "Entered information can be unsafe.",
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
    return res.json({
      id: new Date() + " SMTPmailer" + clientIP,
      links: {
        about: error.about,
      },
      status: "500",
      code: error.code,
      title: "Request failed, mailer conncetion",
      detail: "Cant connect with mailer.",
      source: {
        pointer: error.pointer,
        parametr: error.parametr,
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
