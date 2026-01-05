const mysql = require("mysql2");

const dbConnection = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "1212", 
    database: "supermarket"
});

dbConnection.connect(error => {
    if (error) {
        console.log("Failed to create connection + " + error);
        return;
    }
    console.log("We're connected to MySQL");
});

function execute(sql) {
    return new Promise((resolve, reject) => {
        dbConnection.query(sql, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}

function executeWithParameters(sql, parameters) {
    return new Promise((resolve, reject) => {
        dbConnection.query(sql, parameters, (error, result) => {
            if (error) {
                console.log("Failed interacting with DB, calling reject");
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}

module.exports = {
    execute,
    executeWithParameters
};