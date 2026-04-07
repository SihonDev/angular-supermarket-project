const connection = require("./connection-wrapper");
const ServerError = require("./../errors/server-error");
const ErrorType = require("./../errors/error-type");

async function verifyIfIdOrEmailExists(userRegistrationFormStepOneDetails) {
    let sql = "SELECT * FROM supermarket.users where id =? or email = ?"
    let parameters = [userRegistrationFormStepOneDetails.id, userRegistrationFormStepOneDetails.email];
    try {
        let serverResponse = await connection.executeWithParameters(sql, parameters);
        return serverResponse.length == 0;
    } catch (error) {
        console.error(`[DB_ERROR] Method: verifyIfIdOrEmailExists | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function isThisIdAlreadyExists(id) {
    let sql = "SELECT * FROM supermarket.users where id=?"
    let parameters = [id];
    try {
        let serverResponse = await connection.executeWithParameters(sql, parameters);
        return serverResponse != undefined && serverResponse.length != 0;
    } catch (error) {
        console.error(`[DB_ERROR] Method: isThisIdAlreadyExists | ID: ${id} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function isThisEmailAlreadyExists(email) {
    let sql = "SELECT * FROM supermarket.users where email=?"
    let parameters = [email];
    try {
        let serverResponse = await connection.executeWithParameters(sql, parameters);
        return serverResponse != undefined && serverResponse.length != 0;
    } catch (error) {
        console.error(`[DB_ERROR] Method: isThisEmailAlreadyExists | Email: ${email} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function register(userRegistrationDetails) {
    let sql = "INSERT INTO users (id, firstName, lastName, email, password, city, street, userType)  values(?, ?, ?, ?, ?, ?, ?, ?)";
    let userType = "Client";
    let parameters = [
        userRegistrationDetails.id,
        userRegistrationDetails.firstName,
        userRegistrationDetails.lastName,
        userRegistrationDetails.email,
        userRegistrationDetails.password, // הערה: בייצור יש להשתמש ב-Hash
        userRegistrationDetails.city,
        userRegistrationDetails.street,
        userType
    ];
    try {
        let serverResponse = await connection.executeWithParameters(sql, parameters);
        if (serverResponse.affectedRows == 1) {
            console.log(`[AUTH_EVENT] Action: Register | Email: ${userRegistrationDetails.email} | Status: Success`);
            return [[parameters, true]];
        } else {
            return [[parameters, false]];
        }
    } catch (error) {
        console.error(`[DB_ERROR] Method: register | Email: ${userRegistrationDetails.email} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function login(userLoginDetails) {
    let sql = "SELECT * FROM users where email=? and password =?"
    let parameters = [userLoginDetails.email, userLoginDetails.password];
    try {
        let successfulLoginResponse = await connection.executeWithParameters(sql, parameters);
        
        if (successfulLoginResponse.length > 0) {
            console.log(`[AUTH_EVENT] Action: Login | Email: ${userLoginDetails.email} | Status: Success`);
        } else {
            console.warn(`[AUTH_WARN] Action: Login | Email: ${userLoginDetails.email} | Status: Failed (Wrong Credentials)`);
        }
        
        return successfulLoginResponse;
    } catch (error) {
        console.error(`[DB_ERROR] Method: login | Email: ${userLoginDetails.email} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function getUserId(customerInfo) {
    let sql = "SELECT * FROM supermarket.users where email = ?"
    let parameters = [customerInfo.email];
    try {
        return await connection.executeWithParameters(sql, parameters);
    } catch (error) {
        console.error(`[DB_ERROR] Method: getUserId | Email: ${customerInfo.email} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function isThisCityExistsOnCityList(city) {
    return checkCityInList(city);
}

function checkCityInList(city) {
    let listOfCities = [
        { id: 0, name: 'Jerusalem' },
        { id: 1, name: 'Tel-Aviv' },
        { id: 2, name: 'Haifa' },
        { id: 3, name: 'Rishon Lezion' },
        { id: 4, name: 'Petach Tikva' },
        { id: 5, name: 'Ashdod' },
        { id: 6, name: 'Netanya' },
        { id: 7, name: 'BeerSheva' },
        { id: 8, name: 'Bnei-Brak' },
        { id: 9, name: 'Holon' }
    ];
    
    let cityExistsOnCityList = false;
    for (let i = 0; i < listOfCities.length; i++) {
        if (city == listOfCities[i].name) {
            cityExistsOnCityList = true;
            break;
        }
    }
    return cityExistsOnCityList;
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