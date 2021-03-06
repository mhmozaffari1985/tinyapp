//==========>                  Implemented by Mohammad                   <==========//
//==========>                         2021-07-05                         <==========//
//==========>                                                            <==========//
//==========>                         helper.js                          <==========//
//==========>                                                            <==========//
//==========>                                                            <==========//
//==========>                      Import Libraries                      <==========//
const bcrypt = require('bcryptjs');

//==========>                       Import Modules                       <==========//
const {
  salt
} = require("../express_server");


const generateRandomString = function() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


const checkUserPassword = function(users, email, password) {
  for (const user in users) {
    if (users[user].email === email && bcrypt.compareSync(password, users[user].password)) {
      return user;
    }
  }
  return false;
};

const checkUserExist = function(users, email) {
  for (const userID in users) {
    if (users[userID].email === email) {
      return userID;
    }
  }
};

const createUserURLS = function(urlDatabase, userID) {
  const userURLS = {};
  for (const urlID in urlDatabase) {
    if (urlDatabase[urlID].userID === userID) {
      userURLS[urlID] = {longURL:urlDatabase[urlID].longURL, userID: userID,  createdDate: urlDatabase[urlID].createdDate};
    }
  }
  return userURLS;
};

const listVisitors = (urlID, urlDatabase) => {
  const visitorsList = [];
  if (urlDatabase[urlID]) {
    for (const visitor in urlDatabase[urlID].visited) {
      visitorsList.push(visitor);
    }
  }
  return visitorsList;
};

const listVisits = (urlID, urlDatabase) => {
  const visitsList = [];
  if (urlDatabase[urlID]) {
    for (const visitor in urlDatabase[urlID].visited) {
      for (const visit of urlDatabase[urlID].visited[visitor]) {
        visitsList.push({[visitor] : visit});
      }
    }
  }
  return visitsList;
};


module.exports = {
  generateRandomString,
  checkUserPassword,
  checkUserExist,
  createUserURLS,
  listVisitors,
  listVisits
};