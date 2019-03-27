/*!
 * serve-index
 * Copyright(c) 2011 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 * @private
 */

const accepts = require("accepts");
const createError = require("http-errors");
const debug = require("debug")("serve-index");
const fs = require("fs"),
  path = require("path"),
  normalize = path.normalize,
  sep = path.sep,
  extname = path.extname,
  join = path.join;
const Batch = require("batch");
const parseUrl = require("parseurl");
const resolve = require("path").resolve;

/**
 * Module exports.
 * @public
 */
module.exports = serveIndex;

/**
 * Default render
 * @public
 */
const defaultRender = (filename, stats) => ({
  name: filename,
  size: stats.size,
  type: stats.isDirectory() ? "directory" : "file"
});

function dirTree(root, filename) {
  var stats = fs.lstatSync(filename),
    info = {
      name: path.basename(filename),
      path: path.relative(root, filename)
    };

  if (stats.isDirectory()) {
    info.type = "folder";
    info.children = fs.readdirSync(filename).map(function(child) {
      return dirTree(root, normalize(filename + "/" + child));
    });
  } else {
    // Assuming it's a file. In real life it could be a symlink or
    // something else!
    info.type = "file";
  }

  return info;
}

/**
 * Serve directory listings with the given `root` path.
 *
 * See Readme.md for documentation of options.
 *
 * @param {String} root
 * @param {Object} options
 * @return {Function} middleware
 * @public
 */
function serveIndex(root, options) {
  var opts = options || {};

  // root required
  if (!root) {
    throw new TypeError("serveIndex() root path required");
  }

  // resolve root to absolute and normalize
  var rootPath = normalize(resolve(root) + sep);

  var filter = opts.filter;
  var hidden = opts.hidden;
  var render = opts.render || defaultRender;

  return function(req, res, next) {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.statusCode = "OPTIONS" === req.method ? 200 : 405;
      res.setHeader("Allow", "GET, HEAD, OPTIONS");
      res.setHeader("Content-Length", "0");
      res.end();
      return;
    }

    // parse URLs
    var url = parseUrl(req);
    var originalUrl = parseUrl.original(req);
    var dir = decodeURIComponent(url.pathname);
    var originalDir = decodeURIComponent(originalUrl.pathname);

    // join / normalize from root dir
    var path = normalize(join(rootPath, dir));

    // null byte(s), bad request
    if (~path.indexOf("\0")) return next(createError(400));

    // malicious path
    if ((path + sep).substr(0, rootPath.length) !== rootPath) {
      debug('malicious path "%s"', path);
      return next(createError(403));
    }

    // determine ".." display
    var showUp = normalize(resolve(path) + sep) !== rootPath;

    // check if we have a directory
    debug('stat "%s"', path);
    send(res, "application/json", JSON.stringify(dirTree(path, path)));
  };
}

/**
 * Sort function for with directories first.
 */

function fileSort(a, b) {
  // sort ".." to the top
  if (a.name === ".." || b.name === "..") {
    return a.name === b.name ? 0 : a.name === ".." ? -1 : 1;
  }

  return (
    Number(b.stat && b.stat.isDirectory()) -
      Number(a.stat && a.stat.isDirectory()) ||
    String(a.name)
      .toLocaleLowerCase()
      .localeCompare(String(b.name).toLocaleLowerCase())
  );
}

/**
 * Filter "hidden" `files`, aka files
 * beginning with a `.`.
 *
 * @param {Array} files
 * @return {Array}
 * @api private
 */

function removeHidden(files) {
  return files.filter(function(file) {
    return file[0] !== ".";
  });
}

/**
 * Send a response.
 * @private
 */

function send(res, type, body) {
  // security header for content sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // standard headers
  res.setHeader("Content-Type", type + "; charset=utf-8");
  res.setHeader("Content-Length", Buffer.byteLength(body, "utf8"));

  // body
  res.end(body, "utf8");
}

/**
 * Stat all files and return array of stat
 * in same order.
 */

function stat(dir, files, cb) {
  var batch = new Batch();

  batch.concurrency(10);

  files.forEach(function(file) {
    batch.push(function(done) {
      fs.stat(join(dir, file), function(err, stat) {
        if (err && err.code !== "ENOENT") return done(err);

        // pass ENOENT as null stat, not error
        done(null, stat || null);
      });
    });
  });

  batch.end(cb);
}
