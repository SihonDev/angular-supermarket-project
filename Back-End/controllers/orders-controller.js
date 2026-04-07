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
    // שליפת נתונים בסיסיים ללוג לפני ביצוע הפעולה
    const { city, street, deliveryDate } = request.body;
    
    let successfullAddingOrderData = await ordersLogic.insertOrderInServer(request);
    let getReceiptFromServer = await ordersLogic.getReceipt(request);

    // לוג קריטי: סיום הזמנה בהצלחה
    console.log(`[ORDER_EVENT] Status: Success | City: ${city} | Street: ${street} | DeliveryDate: ${deliveryDate}`);
    
    response.json(successfullAddingOrderData);
  } catch (error) {
    // לוג שגיאה בהזמנה - יכול להעיד על בעיה בתשלום או במלאי
    console.error(`[ORDER_ERROR] Failed to insert order | Error: ${error.message}`);
    return next(error);
  }
});

router.post("/createReceipt", async (request, response, next) => {
  try {
    let getReceiptFromServer = await ordersLogic.createReceipt(request);
    // לוג הנפקת קבלה
    console.log(`[ORDER_EVENT] Action: ReceiptCreated | Status: Success`);
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