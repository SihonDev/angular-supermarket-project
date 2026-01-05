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
  let cartId = [{cart_id:openedCartDetails[0].id}]
  let itemsOfCartDetails = await cartsLogic.getItemsOfCart(cartId);
  let addOrderResponse = await ordersDao.updateUserCartDetails(openedCartDetails);
  let addOrderResponse2 = await ordersDao.insertOrderInServer(userDetails, generalOrderDetails, openedCartDetails, itemsOfCartDetails);
  return [addOrderResponse, addOrderResponse2];
}

async function getReceipt(request) {
  let userDetails = await usersLogic.extractUserDataFromCache(request);
  let id = userDetails[0].id
  let myCartDetails = await ordersDao.getLastOrder(id);
  let myCartDetailsArray = [];
  myCartDetailsArray.push(myCartDetails)
  let itemsOfCart = await cartsLogic.getItemsOfCart(myCartDetailsArray);
  let getReceiptFromServer = await ordersDao.getReceipt(myCartDetails, userDetails, itemsOfCart);
  return getReceiptFromServer;
}

async function createReceipt(request) {
  let userDetails = await usersLogic.extractUserDataFromCache(request);
  let id = userDetails[0].id
  let myCartDetails = await ordersDao.getLastOrder(id);
  let myCartDetailsArray = [];
  myCartDetailsArray.push(myCartDetails)
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
