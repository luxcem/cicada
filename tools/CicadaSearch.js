const fs = require("fs");
const path = require("path");
const normalize = path.normalize;
const lunr = require("lunr");

const MarkdownIt = require("markdown-it");
const meta = require("markdown-it-meta");

const md = new MarkdownIt();
md.use(meta);

function dirTree(root, filename, documents) {
    var stats = fs.lstatSync(filename),
        info = {
            name: path.basename(filename),
            path: path.relative(root, filename),
        };

    if (stats.isDirectory()) {
        fs.readdirSync(filename).map(function(child) {
            return dirTree(root, normalize(filename + "/" + child), documents);
        });
    } else if (filename.endsWith(".md")) {
        // Adds documents to index
        const content = fs.readFileSync(filename, "utf8");
        const renderedDocument = md.render(content);
        documents.push({
            name: filename.replace(/^data\//, ""),
            text: content,
            title: md.meta.title,
        });
    }
    return documents;
}

const rootPath = normalize("data/");
const tree = dirTree(rootPath, rootPath, []);
var idx = lunr(function() {
    this.ref("name");
    this.field("text");

    tree.forEach(function(doc) {
        this.add(doc);
    }, this);
});

module.exports = idx;
// const res = idx.search("dvorak");
// console.log(res);
