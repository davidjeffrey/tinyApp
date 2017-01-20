function generateRandomString() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i=0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

id = generateRandomString()

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let users = {
  "userid": {
    "id":"userid",
    "email": "useremail",
    "password": "userpassword"
  }
};

console.log(users.userid.email)

// users["id1"] = {
//   "id": id,
//   "password": "secret",
//   "email": "gg"
// }

 for (var user in users) {

    if (users[user].email == "useremail") {
      console.log("success")
    }
    else {
      console.log("fail")
      }
    }

