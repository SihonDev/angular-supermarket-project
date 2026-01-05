let ErrorType = {

    //General errors
    GENERAL_ERROR: {
      id: 1,
      httpCode: 600,
      message: "A big fuck up which we'll never tell you of had just happend. And now : A big fat lie....'A general error ....'",
      isShowStackTrace: true
    },
    //Login errors
    UNAUTHORIZED: {
      id: 2,
      httpCode: 401,
      message: "Login failed, invalid user name or password",
      isShowStackTrace: false
    },
    LOGIN_INPUTS_EMPTY: {
      id: 3,
      httpCode: 401,
      message: "User name or password are empty",
      isShowStackTrace: false
    },
    LOGIN_INNCORRECT_USER_NAME: {
      id: 4,
      httpCode: 401,
      message: "Your userName should be in mail form : johndoe@somecompany.com",
      isShowStackTrace: false
    },
    LOGIN_INNCORRECT_PASSWORD: {
      id: 5,
      httpCode: 401,
      message: "Your password size should be between 7-15 and contain only numerical and alphabetical charachters(a-zA-Z)",
      isShowStackTrace: false
    },
  
    //Registration errors
    REGISTER_ID_INNCORRECT_FORMAT: {
      id: 6,
      httpCode: 401,
      message: "Id should be 9 digits with only numbers and no charachters",
      isShowStackTrace: false
    },
    REGISTER_EMAIL_INNCORRECT_FORMAT: {
      id: 7,
      httpCode: 401,
      message: "Your Email should be in mail form : johndoe@somecompany.com",
      isShowStackTrace: false
    },
    REGISTER_INNCORRECT_PASSWORDL_INPUT: {
      id: 8,
      httpCode: 401,
      message: "Your password size should be between 7-15 and contain only numerical and alphabetical charachters(a-zA-Z)",
      isShowStackTrace: false
    },
    REGISTER_PASSWORDS_DONT_MATCH: {
      id: 9,
      httpCode: 401,
      message: "Passwords dont match",
      isShowStackTrace: false
    },
  
    REGISTER_EMAIL_ALREADY_EXISTS: {
      id: 10,
      httpCode: 601,
      message: "Email already exists",
      isShowStackTrace: false
    },
    REGISTER_ID_ALREADY_EXISTS: {
      id: 11,
      httpCode: 601,
      message: "ID already exists",
      isShowStackTrace: false
    },
    REGISTER_CITY_NOT_EXISTS_LIST: {
      id: 12,
      httpCode: 601,
      message: "Please choose a city from the list",
      isShowStackTrace: false
    },
    REGISTER_INNCORRECT_FIRSTNAME_FORMAT: {
      id: 13,
      httpCode: 601,
      message: "Please use only alphabetical letters for first name",
      isShowStackTrace: false
    },
    REGISTER_INNCORRECT_LASTNAME_FORMAT: {
      id: 14,
      httpCode: 601,
      message: "Please use only alphabetical letters for last name",
      isShowStackTrace: false
    },
  
  }
  
  module.exports = ErrorType;
  