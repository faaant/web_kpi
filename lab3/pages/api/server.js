import sanitizeHtml from "sanitize-html";

const rateLimit = require("lambda-rate-limiter")({
  interval: 60 * 1000,
}).check;

export default async function handler(req, res) {
  const clientIP = req.headers["x-forwarded-for"]; //[0];
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

  return res.status(200).json({
    meta: {
      data: {
        message: "Added!",
        article: req.body,
      },
    },
  });
}
