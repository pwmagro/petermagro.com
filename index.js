const https = require('https');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const marked = require("marked");
const fs = require("fs");

require("@dotenvx/dotenvx").config();

const utils = require("./app/js/utils");

app.set("view engine", "ejs");
app.use(bodyParser.json());

app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

let siteMap = utils.buildSiteMap();

app.get('/favicon.ico', (req, res) => {
  res.redirect('res/images/my token 2.png');
});

app.get('/', (req, res) => {
  let name = siteMap.top.name;
  let type = siteMap.top.type;
  let markdownFile = siteMap.top.markdownFile;
  let mdContent = fs.readFileSync(markdownFile).toString();
  let content = marked.parse(mdContent);
  res.render('pages/' + type, {md_content: content, whoami: name, siteMap: siteMap});
});

app.get('*', (req, res) => {
  let url = req.url.slice(1).split('/');
  console.log(url);

  let page = siteMap.pages;
  for (let node of url) {
    if (node == '') continue;
    try {
      page = page[node];
    } catch (error) {
      res.status(404);
      res.render('pages/err');
    }
  }

  console.log(page);

  
  let name = page.name;
  let type = page.type;
  let markdownFile = page.markdownFile;
  let mdContent = fs.readFileSync(markdownFile).toString();
  let content = marked.parse(mdContent);
  res.render('pages/' + type, {md_content: content, whoami: name, siteMap: siteMap});

});

///////////////   THIS   /////////////////////////////////////////////////////////////////////

if (process.env.USING_HTTPS) {
  const httpsOptions = {
    cert: fs.readFileSync(process.env.CERT_FILE),
    key: fs.readFileSync(process.env.KEY_FILE)
  };

  console.log(httpsOptions);

  https.createServer(httpsOptions, app).listen(process.env.HTTPS_PORT);
}
else {
  app.listen(process.env.HTTP_PORT);
}
