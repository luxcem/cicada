const express = require("express");
const next = require("next");

const serveIndex = require("./serveIndex");

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_DEV !== "production";

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler(); //part of next config

const dataDirectory = __dirname + "/../data";

nextApp.prepare().then(() => {
  // express code here
  const app = express();
  app.use("/data", express.static(dataDirectory), serveIndex(dataDirectory));
  app.get("/page/:path", (req, res) => {
    return nextApp.render(req, res, "/index", { path: req.params.path });
  });
  app.get("*", (req, res) => handle(req, res));

  app.listen(PORT, err => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
