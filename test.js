function generateRandomString() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i=0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

console.log(generateRandomString())

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

console.log(urlDatabase.key)