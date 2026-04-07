const express = require("express");
const usersLogic = require("../logic/users-logic");
const router = express.Router();

router.post("/verifyIfIdOrEmailExists", async (request, response, next) => {
  let userRegistrationFormStepOneDetails = request.body;
  try {
    let successfullUserRegistrationFormStepOneDetails = await usersLogic.verifyIfIdOrEmailExists(userRegistrationFormStepOneDetails);
    response.json(successfullUserRegistrationFormStepOneDetails);
  } catch (error) {
    // לוג שגיאה בשלב הבדיקה - יכול להעיד על סריקת משתמשים קיימים
    console.warn(`[AUTH_WARN] ID/Email verification failed | Data: ${JSON.stringify(userRegistrationFormStepOneDetails)} | Error: ${error.message}`);
    return next(error);
  }
});

router.post("/register", async (request, response, next) => {
  let userRegistrationFormStepTwoDetails = request.body;
  try {
    let successfulluserRegistrationFormStepTwoDetails = await usersLogic.register(userRegistrationFormStepTwoDetails);
    
    // לוג אבטחה: הרשמת משתמש חדש
    console.log(`[AUTH_EVENT] Action: Register | Email: ${userRegistrationFormStepTwoDetails.email} | Status: Success`);
    
    response.json(successfulluserRegistrationFormStepTwoDetails);
  } catch (error) {
    console.error(`[AUTH_ERROR] Registration failed | Email: ${userRegistrationFormStepTwoDetails.email} | Error: ${error.message}`);
    return next(error);
  }
});

router.post("/login", async (request, response, next) => {
  const { userEmail } = request.body; // בהנחה שזה השדה ב-body
  try {
    let userLoginDetails = request;
    let successFullLoginDetails = await usersLogic.login(userLoginDetails);
    
    // לוג אבטחה קריטי: כניסה מוצלחת
    console.log(`[AUTH_EVENT] Action: Login | User: ${userEmail} | Status: Success`);
    
    response.json(successFullLoginDetails);
  } catch (error) {
    // לוג אבטחה קריטי: כשל בכניסה (ניסיון פריצה?)
    console.warn(`[AUTH_ALERT] Action: Login | User: ${userEmail} | Status: Failed | Reason: ${error.message}`);
    return next(error);
  }
});

module.exports = router;