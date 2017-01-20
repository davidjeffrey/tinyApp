function generateRandomString() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i=0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

id = generateRandomString()

// users["id1"] = {
//   "id": id,
//   "password": "secret",
//   "email": "gg"
// }

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

let p = function (shortURL) {
  for (user in users) {
    if(!users.hasOwnProperty(user)) continue;
    for (link in users[user]["urlDatabase"]) {
      if (link === shortURL) {
        console.log(users[user]["urlDatabase"][link])
      }

      // if (user.urlDatabase[shortURL]) {
      //   console.log("here")
      // }
    }
  }
}


p("b2xVn2")