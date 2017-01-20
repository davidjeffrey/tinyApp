const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');


function generateRandomString() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i=0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function finder (shortURL) {
  for (user in users) {
    if(!users.hasOwnProperty(user)) continue;
    for (link in users[user]["urlDatabase"]) {
      if (link === shortURL) {
        return users[user]["urlDatabase"][link]
      }
    }
  }
}

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'))

app.set("view engine", "ejs")

app.use(cookieSession({
  name: 'session',
  keys: ["doug"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

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

app.listen(PORT, () => {
  console.log(`TinyApp is listening on port ${PORT}!`);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    userId: req.session.user_id
  }
  if (templateVars.userId) {
    templateVars.email = users[req.session.user_id].email;
    templateVars.urls =  users[req.session.user_id].urlDatabase;
  } else {
    res.end("Error 404 Not Signed in")
  }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    userId: req.session.user_id,
    longURL: req.body.longURL
  }
  if (templateVars.userId) {
    templateVars.email = users[req.session.user_id].email
  }
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  if (finder(req.url.replace("/u/", "")) == undefined) {
    return res.end("Error, could not find that tinyURL!");
  } else {
  return res.redirect(finder(req.url.replace("/u/", "")));
  }
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    userId: req.session.user_id,
  }
  if (templateVars.userId) {
    templateVars.email = users[req.session.user_id].email
    templateVars.longURL = users[req.session.user_id].urlDatabase[req.params.id]
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

app.get("/", (req, res) => {
  res.render("login")
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
    "password": bcrypt.hashSync(req.body.password, 10),
    "urlDatabase": {
    }
  }
  req.session.user_id = (id)
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete users[req.session.user_id].urlDatabase[req.params.id]
  res.redirect("/urls")
});

app.post("/urls/:id/update", (req, res) => {
  users[req.session.user_id].urlDatabase[req.params.id] = req.body.oldLongURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  for (user in users) {
    if (req.body.email === users[user].email && bcrypt.compareSync(req.body.password, users[user].password)) {
      req.session.user_id = (users[user].id)
      res.redirect("/urls")
    }
  }
  res.end("Wrong user name or password")
});

app.post("/urls", (req, res) => {
  for (user in users) {
    if (req.session.user_id === users[user].id) {
      users[req.session.user_id].urlDatabase[generateRandomString()] = req.body.longURL;
      res.redirect("/urls");
      return;
    }
  }
  res.redirect("login")
});

app.use(function (req, res) {
  res.end("Error 404! Page not found")
});
