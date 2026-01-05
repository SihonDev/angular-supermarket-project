const ordersLogic = require("../logic/orders-logic");
const express = require("express");
const router = express.Router();

router.get("/getTheTotalNumberOfSubmittedOrders", async (request, response, next) => {
  try {
    let numberOfOrdersSubmitted = await ordersLogic.getTheTotalNumberOfSubmittedOrders();
    response.json(numberOfOrdersSubmitted);
  } catch (error) {
    return next(error);
  }
});

router.post("/getCityNameFromServer", async (request, response, next) => {
  try {
    let customerInfoFromServer = await ordersLogic.getCityNameFromServer(request);
    response.json(customerInfoFromServer);
  } catch (error) {
    return next(error);
  }
});

router.get("/sameDateShipeDate", async (request, response, next) => {
  try {
    let getSameDateShipeDate = await ordersLogic.sameDateShipeDate(request);
    response.json(getSameDateShipeDate);
  } catch (error) {
    return next(error);
  }
});

router.post("/getStreetNameFromServer", async (request, response, next) => {
  try {
    let customerInfoFromServer = await ordersLogic.getStreetNameFromServer(request);
    response.json(customerInfoFromServer);
  } catch (error) {
    return next(error);
  }
});

router.post("/insertOrderInServer", async (request, response, next) => {
  try {
    let successfullAddingOrderData = await ordersLogic.insertOrderInServer(request);
    let getReceiptFromServer = await ordersLogic.getReceipt(request);
    response.json(successfullAddingOrderData);
  } catch (error) {
    return next(error);
  }
});

router.post("/createReceipt", async (request, response, next) => {
  try {
    let getReceiptFromServer = await ordersLogic.createReceipt(request);
    response.json(getReceiptFromServer);
  } catch (error) {
    return next(error);
  }
});

router.post("/sameDateShipeDate", async (request, response, next) => {
  try {
    let getSameDateShipeDate = await ordersLogic.sameDateShipeDate(request);
    response.json(getSameDateShipeDate);
  } catch (error) {
    return next(error);
  }
});



module.exports = router;