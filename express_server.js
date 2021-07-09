//==========>                  Implemented by Mohammad                   <==========//
//==========>                         2021-07-05                         <==========//
//==========>                                                            <==========//
//==========>                     express_server.js                      <==========//
//==========>                                                            <==========//
//==========>                                                            <==========//
//==========>                      Import Libraries                      <==========//
const express = require("express");
const path = require('path');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');

//==========>                       Import Modules                       <==========//
const {
  urlDatabase,
  users
} = require("./data");
const {
  generateRandomString,
  checkUserPassword,
  checkUserExist,
  createUserURLS
} = require("./helpers/helpers");
const generateAuthenticator = require('./helpers/authentication');

//==========>                      Global Variables                      <==========//
const app = express();
const PORT = 8080; // default port 8080
const salt = bcrypt.genSaltSync(10);

//==========>                   Configuration Section                    <==========//
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(cookieSession({
  name: "session",
  keys: ["secretsecretIgotAsecret", "SuiteMadameBlue"]
}));
app.use('/', generateAuthenticator(users));
app.use(methodOverride('_method'));

//==========>                        Start Point                         <==========//
app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});

//==========>                   Request Handle Section                   <==========//
//==========>                                                            <==========//
//==========>                         Home Page                          <==========//
app.get("/", (req, res) => {
  res.redirect("/urls");
});

//==========>                         URls Page                          <==========//
app.get("/urls", (req, res) => {
  const userID = checkUserExist(users, req.session.email);
  const userURLS = createUserURLS(urlDatabase, userID);
  const templateVars = {
    user: req.session.email,
    urls: userURLS
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const user = checkUserExist(users, req.session.email);
  console.log(user + "end");
  urlDatabase[generateRandomString()] = {longURL : req.body.longURL,  userID: user};
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: req.session.email
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    user: req.session.email,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
  };
  res.render("urls_show", templateVars);
});

app.put("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  const templateVars = {
    user: req.session.email,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
  };
  res.render("urls_show", templateVars);
});

app.delete("/urls/:shortURL", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});



//==========>                         Login Page                         <==========//
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies["userId"]] ? users[req.cookies["userId"]] : null,
    message: req.cookies["message"] ? req.cookies["message"] : null,
    errMessage: req.cookies["errMessage"] ? req.cookies["errMessage"] : null
  };
  res.clearCookie('message');
  res.clearCookie('errMessage');
  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.render("login_form", templateVars);

});
app.post("/login", (req, res) => {
  const userId = checkUserPassword(users, req.body.email, req.body.password);
  if (userId) {
    res.clearCookie('errMesssage');
    res.clearCookie('messsage');
    req.session.email = req.body.email;
    res.redirect("/urls");
  } else {
    res.cookie('errMessage', 'The email or password isn\'t correct!');
    res.redirect("/login");
  }
});

app.post("/logout", (req, res) => {
  res.cookie('message', 'You have logged out!');
  res.redirect("/login");
});

//==========>                       Register Page                        <==========//
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies["userId"]] ? users[req.cookies["userId"]] : null,
    message: req.cookies["message"] ? req.cookies["message"] : null,
    errMessage: req.cookies["errMessage"] ? req.cookies["errMessage"] : null
  };
  res.clearCookie('message');
  res.clearCookie('errMessage');
  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.render("register_form", templateVars);
});

app.post("/register", (req, res) => {
  if (!req.body.password || !req.body.email) {
    res.cookie('errMessage', 'The email or password has not been provided!');
    res.redirect("/register");
  } else if (checkUserExist(users, req.body.email)) {
    res.cookie('errMessage', 'The email already exists!');
    res.redirect("/register");
  } else {
    const id = generateRandomString();
    users[id] = {
      id,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt)
    };
    res.clearCookie('message');
    res.clearCookie('errMessage');
    res.clearCookie('session');
    res.clearCookie('session.sig');
    req.session.email = req.body.email;
    res.redirect("/urls");
  }
});


//==========>                       Export Modules                       <==========//
module.exports = {
  salt
};