const connection = require("./connection-wrapper");
const ServerError = require("./../errors/server-error");
const ErrorType = require("./../errors/error-type");

async function verifyIfIdOrEmailExists(userRegistrationFormStepOneDetails) {
  let sql = "SELECT * FROM supermarket.users where id =? or email = ?"
  let parameters = [userRegistrationFormStepOneDetails.id, userRegistrationFormStepOneDetails.email];
  try {
    let serverResponse = await connection.executeWithParameters(sql, parameters);
    if (serverResponse.length == 0) {
      return true
    } else {
      return false
    }
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function isThisIdAlreadyExists(id) {
  let sql = "SELECT * FROM supermarket.users where id=?"
  let parameters = [id];
  try {let serverResponse = await connection.executeWithParameters(sql, parameters);
    if (serverResponse != undefined && serverResponse.length != 0) {
      return true
    } else {
      return false
    }
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function isThisEmailAlreadyExists(email) {
  let sql = "SELECT * FROM supermarket.users where email=?"
  let parameters = [email];
  try {let serverResponse = await connection.executeWithParameters(sql, parameters);
    if (serverResponse != undefined && serverResponse.length != 0) {
      return true
    } else {
      return false
    }
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function register(userRegistrationDetails) {
  let sql = "INSERT INTO users (id, firstName, lastName, email, password, city, street, userType)  values(?, ?, ?, ?, ?, ?, ?, ?)";
  let userType = "Client"
  let parameters = [
    userRegistrationDetails.id,
    userRegistrationDetails.firstName,
    userRegistrationDetails.lastName,
    userRegistrationDetails.email,
    userRegistrationDetails.password,
    userRegistrationDetails.city,
    userRegistrationDetails.street,
    userType
  ];
  try {
    let serverResponse = await connection.executeWithParameters(sql, parameters);
    if (serverResponse.affectedRows == 1) {
      return [
        [parameters, true]
      ]
    } else return [
      [parameters, false]
    ]
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function login(userLoginDetails) {
  let sql = "SELECT * FROM users where email=? and password =?"
  let parameters = [ userLoginDetails.email, userLoginDetails.password];
  try {
    let successfulLoginResponse = await connection.executeWithParameters(sql, parameters);
    return successfulLoginResponse
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

//////check
async function getUserId(customerInfo) {
  let sql = "SELECT * FROM supermarket.users where email = ?"
  let parameters = [
    customerInfo.email,
  ];
  try {
    return serverResponse = await connection.executeWithParameters(sql, parameters);

  } catch (eerror) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

//////check
async function isThisCityExistsOnCityList(city) {
  return checkCityInList(city)
}

//////check
function checkCityInList(city) {
  let listOfCities = [{
    id: 0,
    name: 'Jerusalem',
  },
  {
    id: 1,
    name: 'Tel-Aviv',
  },

  {
    id: 2,
    name: 'Haifa',
  },

  {
    id: 3,
    name: 'Rishon Lezion',
  },
  {
    id: 4,
    name: 'Petach Tikva',
  },
  {
    id: 5,
    name: 'Ashdod',
  },
  {
    id: 6,
    name: 'Netanya',
  },
  {
    id: 7,
    name: 'BeerSheva',
  },
  {
    id: 8,
    name: 'Bnei-Brak',
  },

  {
    id: 9,
    name: 'Holon',
  },
  ]
  let cityExistsOnCityList = false
  for (let i = 0; i < listOfCities.length; i++) {

    if (city == listOfCities[i].name) {
      cityExistsOnCityList = true
    }
    if (cityExistsOnCityList == true) {
      break
    }
  }
  return cityExistsOnCityList
}

module.exports = {
  login,
  register,
  verifyIfIdOrEmailExists,
  isThisIdAlreadyExists,
  isThisEmailAlreadyExists,
  getUserId,
  isThisCityExistsOnCityList,
};