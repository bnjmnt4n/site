#!/usr/bin/env node

var fs = require("fs"),
    path = require("path"),
    url = require("url");

var vendorPath = path.join(__dirname, "_vendor"),
    marked = require(path.join(vendorPath, "marked"));

var renderer = new marked.Renderer();

renderer.heading = function (text, level) {
  var titleText = text
    .replace(/^[a-z]/i, function (str) {
      return str.toUpperCase();
    })
    .replace(/-([a-z])/gi, function (_, str) {
      return ' ' + str.toUpperCase();
    });

  return '<h' + level + '>' +
         '<span class=text>' + titleText + '</span>' +
         ' <a class=anchor name="' + text + '" href="#' + text + '">#</a>' +
         '</h' + level + '>';
};

marked.setOptions({
  "renderer": renderer,
  "smartypants": true
});

// Generate the GitHub project page.
fs.readFile(path.join(__dirname, "README.md"), "utf8", function readInfo(exception, source) {
  if (exception) {
    console.log(exception);
  } else {
    // Read the project page template.
    fs.readFile(path.join(__dirname, "page", "page.html"), "utf8", readTemplate);
  }

  // Interpolates the page template and writes the result to disk.
  function readTemplate(exception, page) {
    if (exception) {
      console.log(exception);
    } else {
      // Write the page source to disk.
      fs.writeFile(path.join(__dirname, "index.html"), page.replace(/<%=\s*(.+?)\s*%>/g, function interpolate(match, data) {
        switch (data) {
          case "source":
            // Convert the read me to HTML and insert it into the page body.
            return marked(source);
        }
        return "";
      }), function writePage(exception) {
        console.log(exception || "GitHub project page generated successfully.");
      });
    }
  }
});
