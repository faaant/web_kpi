import sanitizeHtml from "sanitize-html";

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
      status: "429",
      meta: {
        data: {
          message: "Too many requests!",
        },
      },
    });
  }

  //iterating object
  for (let key in req.body) {
    if (req.body[key] === null) {
      return res.status(400).json({
        status: "400",
        meta: {
          data: {
            message: "No one field shouldn't be empty!",
          },
        },
      });
    }
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
