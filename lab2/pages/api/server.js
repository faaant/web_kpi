import isEmail from "../../src/checkEmail";
import sanitizeHtml from "sanitize-html";

const nodemailer = require("nodemailer");
const rateLimit = require("lambda-rate-limiter")({
  interval: 60 * 1000,
}).check;

export default async function handler(req, res) {
  try {
    await rateLimit(10, req.headers["x-forwarded-for"][0]);
  } catch (error) {
    return res.json({
      id: new Date() + " rate limit" + req.headers["x-forwarded-for"],
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
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  for (let key in req.body) {
    if (!req.body[key]) {
      return res.json({
        id: new Date() + " check not null" + req.headers["x-forwarded-for"],
        status: "500",
        title: "Request failed",
        detail: "All keys must have not null values.",
        meta: {
          data: {
            message: "No one field shouldn't be empty!",
          },
        },
      });
    }
  }

  if (!isEmail(req.body.email)) {
    return res.status(500).json({
      id: new Date() + " check mail" + req.headers["x-forwarded-for"],
      status: "500",
      title: "Request failed",
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
      id: new Date() + " clear info" + req.headers["x-forwarded-for"],
      status: "500",
      title: "Request failed",
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
      id: new Date() + " SMTPmailer" + req.headers["x-forwarded-for"],
      links: {
        about: error.about,
      },
      status: "500",
      code: error.code,
      title: "Request failed",
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
