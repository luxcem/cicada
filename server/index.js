const express = require("express");
const next = require("next");

const serveIndex = require("./serveIndex");
const searchIndex = require("../tools/CicadaSearch");

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_DEV !== "production";

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler(); //part of next config

const dataDirectory = __dirname + "/../data";

nextApp.prepare().then(() => {
    // express code here
    const app = express();
    app.use("/data", express.static(dataDirectory), serveIndex(dataDirectory));
    app.get("/s/", (req, res) => {
        // console.log(res);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(searchIndex.search(req.query.q)));
    });
    // Home page
    app.get("/", (req, res) => {
        return nextApp.render(req, res, "/index", { path: "index.md" });
    });
    // Pages
    app.get("/:path", (req, res) => {
        return nextApp.render(req, res, "/index", { path: req.params.path });
    });
    app.get("*", (req, res) => handle(req, res));

    app.listen(PORT, err => {
        if (err) throw err;
        console.log("> Ready on http://localhost:3000");
    });
});
