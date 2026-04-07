const mysql = require("mysql2");

const dbConnection = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "1212", 
    database: "supermarket"
});

dbConnection.connect(error => {
    if (error) {
        // לוג קריטי: כשל בחיבור למסד הנתונים
        console.error("[DB_CRITICAL] Failed to create connection: " + error.message);
        return;
    }
    // לוג מערכת: חיבור תקין
    console.log("[DB_INFO] MySQL connection successful");
});

function execute(sql) {
    return new Promise((resolve, reject) => {
        dbConnection.query(sql, (error, result) => {
            if (error) {
                // לוג שגיאת שאילתה
                console.error(`[DB_QUERY_ERROR] SQL: ${sql} | Error: ${error.message}`);
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
                // לוג שגיאת שאילתה עם פרמטרים
                console.error(`[DB_QUERY_ERROR] SQL: ${sql} | Params: ${JSON.stringify(parameters)} | Error: ${error.message}`);
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