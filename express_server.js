var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");

function generateRandomString() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i=0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs")

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  delete urlDatabase[shortURL]
  res.redirect("/urls")
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {
  shortURL = req.url.replace("/u/", "");
  longURL = urlDatabase[shortURL]
  if (longURL == undefined) {
    res.end("Error, could not find that tinyURL!");
  }
  res.redirect(longURL);
});


app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});


app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
  let longURL = req.body;
  let shortURL = generateRandomString()
  urlDatabase[shortURL] = longURL.longURL;
  res.redirect("/urls")
});

app.post("/urls/:id/update", (req, res) => {
  let shortURL = req.params.id;
  let newLongURL = req.body.oldLongURL;
  urlDatabase[shortURL] = newLongURL;
  res.redirect("/urls")
});

app.use(function (req, res) {
  res.end("Error 404! Page not found")
});
