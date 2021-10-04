import sanitizeHtml from "sanitize-html";

export default async function checker(req, res) {
  const letter = {
    from: req.body.from, // sender address
    to: req.body.to, // list of receivers
    subject: "Subject", // Subject line
    text: req.body.text, // plain text body
    html: sanitizeHtml(req.body.html), // html body
  };
  res.json(letter);
}
