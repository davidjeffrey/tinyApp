

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let req = "/u/b2xVn2"

req = req.replace("/u/", "");

longURL = urlDatabase[req]

console.log(longURL)
