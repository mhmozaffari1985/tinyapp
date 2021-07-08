const { assert } = require('chai');

const { checkUserExist } = require('../helpers/helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('checkUserExist', function() {
  it('should return a user with valid email', function() {
    const userID = checkUserExist(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    assert.equal(userID,expectedOutput);
  });
  it('should return a user with valid email', function() {
    const userID = checkUserExist(testUsers, "user3@example.com");
    const expectedOutput = undefined;
    assert.equal(userID,expectedOutput);
  });
});