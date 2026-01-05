const usersDao = require("../dao/users-dao");
const cacheModule = require("./cache-module");
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const crypto = require("crypto");
const ServerError = require("../errors/server-error");
const ErrorType = require("../errors/error-type");
const RIGHT_SALT = "ksdjfhbAWEDCAS29!@$addlkmn";
const LEFT_SALT = "32577098ASFKJkjsdhfk#$dc";


async function verifyIfIdOrEmailExists(userRegistrationFormStepOneDetails) {
  if (await usersDao.isThisIdAlreadyExists(userRegistrationFormStepOneDetails.id)) {
    console.log('This id is already exists')
    throw new ServerError(ErrorType.REGISTER_ID_ALREADY_EXISTS);
  }
  if (await usersDao.isThisEmailAlreadyExists(userRegistrationFormStepOneDetails.email)) {
    console.log('This email is already exists')
    throw new ServerError(ErrorType.REGISTER_EMAIL_ALREADY_EXISTS);
  }
  let registrationStepOneServerResponse = await usersDao.verifyIfIdOrEmailExists(userRegistrationFormStepOneDetails);
  return registrationStepOneServerResponse
}

async function register(userRegistrationFormStepTwoDetails) {
  if (!userRegistrationFormStepTwoDetails.firstName.match(/^[a-zA-Z]+$/)) {
    console.log('This first name is not in the correct format')
    throw new ServerError(ErrorType.REGISTER_INNCORRECT_FIRSTNAME_FORMAT);
  }
  if (!userRegistrationFormStepTwoDetails.lastName.match(/^[a-zA-Z]+$/)) {
    console.log('incorrect chars in last name')
    throw new ServerError(ErrorType.REGISTER_INNCORRECT_LASTNAME_FORMAT);
  }
  let generateHashedPassword = userRegistrationFormStepTwoDetails.password
  userRegistrationFormStepTwoDetails.password = crypto.createHash("md5").update(LEFT_SALT + userRegistrationFormStepTwoDetails.password + RIGHT_SALT).digest("hex");
  let loginDetails = await usersDao.register(userRegistrationFormStepTwoDetails);
  let userLoginDetails = {
    email: userRegistrationFormStepTwoDetails.email,
    password: generateHashedPassword
  }
  let loginAfterRegistrationComplete = this.autoLoginAfterRegistration(userLoginDetails)
  return loginAfterRegistrationComplete
}

async function autoLoginAfterRegistration(userLoginDetails) {
  if (userLoginDetails.email == "" || userLoginDetails.email == undefined || userLoginDetails.password == "" || userLoginDetails.password == undefined) {
    throw new ServerError(ErrorType.LOGIN_INPUTS_EMPTY);
  }
  userLoginDetails.password = crypto.createHash("md5").update(LEFT_SALT + userLoginDetails.password + RIGHT_SALT).digest("hex");
  let userLoginData = await usersDao.login(userLoginDetails);
  if (userLoginData == null || userLoginData.length == 0) {
    throw new ServerError(ErrorType.UNAUTHORIZED);
  } else {
    let saltedUserName = LEFT_SALT + userLoginData.email + RIGHT_SALT;
    const jwtToken = jwt.sign({ sub: saltedUserName }, config.secret);
    cacheModule.set(jwtToken, userLoginData);
    userLoginData[0].password = jwtToken
    return userLoginData;
  }
}

async function login(request) {
  let userLoginDetails = request.body
  if (userLoginDetails.email == "" || userLoginDetails.email == undefined || userLoginDetails.password == "" || userLoginDetails.password == undefined) {
    throw new ServerError(ErrorType.LOGIN_INPUTS_EMPTY);
  }
  if (!userLoginDetails.email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
    throw new ServerError(ErrorType.LOGIN_INNCORRECT_USER_NAME);
  }
  if (!userLoginDetails.password.match(/^[a-zA-Z0-9!_%+-]\w{4,10}$/)) {
    throw new ServerError(ErrorType.LOGIN_INNCORRECT_PASSWORD);
  }
  userLoginDetails.password = crypto.createHash("md5").update(LEFT_SALT + userLoginDetails.password + RIGHT_SALT).digest("hex");
  let userLoginData = await usersDao.login(userLoginDetails);
  if (userLoginData == null || userLoginData.length == 0) {
    throw new ServerError(ErrorType.UNAUTHORIZED);
  } else {
    let saltedUserName = LEFT_SALT + userLoginData.email + RIGHT_SALT;
    const jwtToken = jwt.sign({ sub: saltedUserName }, config.secret);
    cacheModule.set(jwtToken, userLoginData);
    userLoginData[0].password = jwtToken
    return userLoginData;
  }
}

async function getUserId(customerInfo) {
  let customerRelevantInfo = await usersDao.getUserId(customerInfo);
  return customerRelevantInfo;
}

function extractUserDataFromCache(request) {
  let authorizationString = request.headers["authorization"]
  let token = authorizationString.substring("Bearer ".length)
  let userData = cacheModule.get(token)
  return userData
}

module.exports = {
  verifyIfIdOrEmailExists,
  register,
  autoLoginAfterRegistration,
  login,
  getUserId,
  extractUserDataFromCache,
};