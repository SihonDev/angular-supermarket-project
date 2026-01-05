const express = require("express");
const usersLogic = require("../logic/users-logic");
const router = express.Router();

router.post("/verifyIfIdOrEmailExists", async (request, response, next) => {
  let userRegistrationFormStepOneDetails = request.body;
  try {
    let successfullUserRegistrationFormStepOneDetails = await usersLogic.verifyIfIdOrEmailExists(userRegistrationFormStepOneDetails);
    response.json(successfullUserRegistrationFormStepOneDetails);
  } catch (error) {
    return next(error);
  }
});

router.post("/register", async (request, response, next) => {
  let userRegistrationFormStepTwoDetails = request.body;
  try {
    let successfulluserRegistrationFormStepTwoDetails = await usersLogic.register(userRegistrationFormStepTwoDetails);
    response.json(successfulluserRegistrationFormStepTwoDetails);
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (request, response, next) => {
  try {
    let userLoginDetails = request
    let successFullLoginDetails = await usersLogic.login(userLoginDetails);
    response.json(successFullLoginDetails);
  } catch (error) {
    return next(error);
  }
})

module.exports = router;