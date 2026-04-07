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
    console.warn(`[AUTH_WARN] Registration Step 1: ID already exists | ID: ${userRegistrationFormStepOneDetails.id}`);
    throw new ServerError(ErrorType.REGISTER_ID_ALREADY_EXISTS);
  }
  if (await usersDao.isThisEmailAlreadyExists(userRegistrationFormStepOneDetails.email)) {
    console.warn(`[AUTH_WARN] Registration Step 1: Email already exists | Email: ${userRegistrationFormStepOneDetails.email}`);
    throw new ServerError(ErrorType.REGISTER_EMAIL_ALREADY_EXISTS);
  }
  let registrationStepOneServerResponse = await usersDao.verifyIfIdOrEmailExists(userRegistrationFormStepOneDetails);
  return registrationStepOneServerResponse
}

async function register(userRegistrationFormStepTwoDetails) {
  if (!userRegistrationFormStepTwoDetails.firstName.match(/^[a-zA-Z]+$/)) {
    throw new ServerError(ErrorType.REGISTER_INNCORRECT_FIRSTNAME_FORMAT);
  }
  if (!userRegistrationFormStepTwoDetails.lastName.match(/^[a-zA-Z]+$/)) {
    throw new ServerError(ErrorType.REGISTER_INNCORRECT_LASTNAME_FORMAT);
  }

  let rawPassword = userRegistrationFormStepTwoDetails.password;
  // Hashing with MD5 + Salts
  userRegistrationFormStepTwoDetails.password = crypto.createHash("md5").update(LEFT_SALT + rawPassword + RIGHT_SALT).digest("hex");
  
  console.log(`[AUTH_EVENT] Creating new user | Email: ${userRegistrationFormStepTwoDetails.email}`);
  
  await usersDao.register(userRegistrationFormStepTwoDetails);
  
  let userLoginDetails = {
    email: userRegistrationFormStepTwoDetails.email,
    password: rawPassword
  }
  
  return await this.autoLoginAfterRegistration(userLoginDetails);
}

async function autoLoginAfterRegistration(userLoginDetails) {
  if (!userLoginDetails.email || !userLoginDetails.password) {
    throw new ServerError(ErrorType.LOGIN_INPUTS_EMPTY);
  }

  userLoginDetails.password = crypto.createHash("md5").update(LEFT_SALT + userLoginDetails.password + RIGHT_SALT).digest("hex");
  let userLoginData = await usersDao.login(userLoginDetails);

  if (!userLoginData || userLoginData.length == 0) {
    console.error(`[AUTH_ERROR] Auto-login failed after registration | Email: ${userLoginDetails.email}`);
    throw new ServerError(ErrorType.UNAUTHORIZED);
  } else {
    const jwtToken = jwt.sign({ sub: LEFT_SALT + userLoginData[0].email + RIGHT_SALT }, config.secret);
    cacheModule.set(jwtToken, userLoginData);
    
    console.log(`[AUTH_EVENT] Auto-login success | UserID: ${userLoginData[0].id}`);
    
    userLoginData[0].password = jwtToken;
    return userLoginData;
  }
}

async function login(request) {
  let userLoginDetails = request.body;
  
  if (!userLoginDetails.email || !userLoginDetails.password) {
    throw new ServerError(ErrorType.LOGIN_INPUTS_EMPTY);
  }
  if (!userLoginDetails.email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
    throw new ServerError(ErrorType.LOGIN_INNCORRECT_USER_NAME);
  }
  
  console.log(`[AUTH_EVENT] Login attempt | Email: ${userLoginDetails.email}`);

  userLoginDetails.password = crypto.createHash("md5").update(LEFT_SALT + userLoginDetails.password + RIGHT_SALT).digest("hex");
  let userLoginData = await usersDao.login(userLoginDetails);

  if (!userLoginData || userLoginData.length == 0) {
    console.warn(`[AUTH_WARN] Login failed | Email: ${userLoginDetails.email} | Reason: Invalid Credentials`);
    throw new ServerError(ErrorType.UNAUTHORIZED);
  } else {
    const jwtToken = jwt.sign({ sub: LEFT_SALT + userLoginData[0].email + RIGHT_SALT }, config.secret);
    cacheModule.set(jwtToken, userLoginData);
    
    console.log(`[AUTH_EVENT] Login success | UserID: ${userLoginData[0].id} | Type: ${userLoginData[0].userType}`);
    
    userLoginData[0].password = jwtToken;
    return userLoginData;
  }
}

async function getUserId(customerInfo) {
  return await usersDao.getUserId(customerInfo);
}

function extractUserDataFromCache(request) {
  try {
    let authorizationString = request.headers["authorization"];
    if (!authorizationString) {
        console.warn(`[AUTH_WARN] Missing Authorization header`);
        return null;
    }
    let token = authorizationString.substring("Bearer ".length);
    let userData = cacheModule.get(token);
    
    if (!userData) {
        console.warn(`[AUTH_WARN] Token not found in cache or expired`);
    }
    
    return userData;
  } catch (err) {
    console.error(`[SYSTEM_ERROR] Failed to extract user from cache: ${err.message}`);
    return null;
  }
}

module.exports = {
  verifyIfIdOrEmailExists,
  register,
  autoLoginAfterRegistration,
  login,
  getUserId,
  extractUserDataFromCache,
};