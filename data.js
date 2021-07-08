//==========>                  Implemented by Mohammad                   <==========//
//==========>                         2021-07-05                         <==========//
//==========>                                                            <==========//
//==========>                          data.js                           <==========//
//==========>                                                            <==========//
//==========>                                                            <==========//
//==========>                      Import Libraries                      <==========//
const bcrypt = require('bcryptjs');

//==========>                       Import Modules                       <==========//
const {
  salt
} = require("./express_server");



module.exports = {
  urlDatabase: {
    b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "user3RandomID"
    },
    i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "userRandomID"
    }
  },

  users: {
    "userRandomID": {
      id: "userRandomID",
      email: "user@example.com",
      password: bcrypt.hashSync("purple-monkey-dinosaur", salt)
    },
    "user2RandomID": {
      id: "user2RandomID",
      email: "user2@example.com",
      password: bcrypt.hashSync("dishwasher-funk", salt)
    },
    "user3RandomID": {
      id: "user3RandomID",
      email: "test@test.com",
      password: bcrypt.hashSync("123", salt)
    }
  }
};