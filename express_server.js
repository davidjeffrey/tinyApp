var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')


function generateRandomString() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i=0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'))

app.set("view engine", "ejs")

app.use(cookieParser())

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let users = {
  "userid": {
    "id":"userid",
    "email": "useremail",
    "password": "userpassword",
    "urlDatabase": {
      "b2xVn2": "http://www.lighthouselabs.ca",
      "9sm5xK": "http://www.google.com"
    }
  }
};

console.log(users.userid.sUrls)

app.listen(PORT, () => {
  console.log(`TinyApp is listening on port ${PORT}!`);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    userId: req.cookies.userId,
    userInfo: users[req.cookies.userId].urlDatabase
  }
  if (templateVars.userId) {
    templateVars.email = users[req.cookies.userId].email
  }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    userId: req.cookies.userId,
  }
  if (templateVars.userId) {
    templateVars.email = users[req.cookies.userId].email
  }
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    userId: req.cookies.userId,
  }
  if (templateVars.userId) {
    templateVars.email = users[req.cookies.userId].email
  }
  if (urlDatabase[req.url.replace("/u/", "")] == undefined) {
    res.end("Error, could not find that tinyURL!");
  }
  res.redirect(urlDatabase[req.url.replace("/u/", "")]);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    userId: req.cookies.userId,
  }
  if (templateVars.userId) {
    templateVars.email = users[req.cookies.userId].email
  }
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/register", (req, res) => {
  for (user in users) {
    if (req.body.email === users[user].email || req.body.password.length < 1 || req.body.email.length < 1) {
      res.end("Error Will Robinson!!! 404")
      return;
    }
  }
  let id = generateRandomString()
  users[id] = {
    "id": id,
    "email": req.body.email,
    "password": req.body.password
  }
  res.cookie("userId", id)
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
});

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.oldLongURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  for (user in users) {
    if (req.body.email === users[user].email && req.body.password === users[user].password) {
      res.cookie("userId", users[user].id)
      res.redirect("/urls")
    }
  }
  res.end("Wrong user name or password")
});

app.post("/urls", (req, res) => {
  for (user in users) {
    if (req.cookies.userId === users[user].id) {
      urlDatabase[generateRandomString()] = req.body.longURL;
      res.redirect("/urls");
      return;
    }
  }
  res.redirect("login")
});

app.use(function (req, res) {
  res.end("Error 404! Page not found")
});
