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

  return res.status(200).json({
    meta: {
      data: {
        message: "Added!",
        article: req.body,
      },
    },
  });
}
