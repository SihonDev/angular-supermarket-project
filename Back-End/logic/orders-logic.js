const ordersDao = require("../dao/orders-dao");
const usersLogic = require("./users-logic");
const cartsLogic = require("../logic/carts-logic");

async function getTheTotalNumberOfSubmittedOrders() {
  let numberOfOrdersSubmitted = await ordersDao.getTheTotalNumberOfSubmittedOrders();
  return numberOfOrdersSubmitted;
}

async function getCityNameFromServer(request) {
  let userDetails = await usersLogic.extractUserDataFromCache(request);
  let id = userDetails[0].id
  let customerInfoFromServer = await ordersDao.getCityNameFromServer(id);
  return customerInfoFromServer;
}

async function getStreetNameFromServer(request) {
  let userDetails = await usersLogic.extractUserDataFromCache(request);
  let id = userDetails[0].id
  let customerInfoFromServer = await ordersDao.getStreetNameFromServer(id);
  return customerInfoFromServer;
}

async function sameDateShipeDate() {
  let invalidDatesFromServer = await ordersDao.sameDateShipeDate();
  return invalidDatesFromServer;
}

async function insertOrderInServer(request) {
  let userDetails = await usersLogic.extractUserDataFromCache(request);
  let generalOrderDetails = request.body
  let openedCartDetails = await cartsLogic.getIdOfOpenedCart(userDetails);
  
  if (!openedCartDetails || openedCartDetails.length === 0) {
    console.warn(`[LOGIC_WARN] Order attempt failed: No open cart found | UserID: ${userDetails[0].id}`);
    throw new Error("No open cart found");
  }

  let cartId = [{cart_id:openedCartDetails[0].id}]
  let itemsOfCartDetails = await cartsLogic.getItemsOfCart(cartId);
  
  console.log(`[LOGIC_EVENT] Processing Order | UserID: ${userDetails[0].id} | CartID: ${openedCartDetails[0].id}`);

  let addOrderResponse = await ordersDao.updateUserCartDetails(openedCartDetails);
  let addOrderResponse2 = await ordersDao.insertOrderInServer(userDetails, generalOrderDetails, openedCartDetails, itemsOfCartDetails);
  
  console.log(`[LOGIC_EVENT] Order completed successfully | UserID: ${userDetails[0].id}`);
  
  return [addOrderResponse, addOrderResponse2];
}

async function getReceipt(request) {
  let userDetails = await usersLogic.extractUserDataFromCache(request);
  let id = userDetails[0].id
  let myCartDetails = await ordersDao.getLastOrder(id);
  
  if (!myCartDetails) {
    console.warn(`[LOGIC_WARN] Receipt request failed: No orders found | UserID: ${id}`);
    return null;
  }

  let myCartDetailsArray = [];
  myCartDetailsArray.push(myCartDetails)
  let itemsOfCart = await cartsLogic.getItemsOfCart(myCartDetailsArray);
  
  console.log(`[LOGIC_EVENT] Generating Receipt | UserID: ${id} | OrderID: ${myCartDetails.id}`);
  
  let getReceiptFromServer = await ordersDao.getReceipt(myCartDetails, userDetails, itemsOfCart);
  return getReceiptFromServer;
}

async function createReceipt(request) {
  let userDetails = await usersLogic.extractUserDataFromCache(request);
  let id = userDetails[0].id
  let myCartDetails = await ordersDao.getLastOrder(id);
  let myCartDetailsArray = [];
  if (myCartDetails) {
    myCartDetailsArray.push(myCartDetails);
  }
  return myCartDetailsArray;
}


module.exports = {
  insertOrderInServer,
  getCityNameFromServer,
  getStreetNameFromServer,
  getTheTotalNumberOfSubmittedOrders,
  getReceipt,
  createReceipt,
  sameDateShipeDate
};