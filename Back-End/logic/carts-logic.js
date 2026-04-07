const cartsDao = require("../dao/carts-dao");
const ordersDao = require("../dao/orders-dao");
const usersLogic = require("../logic/users-logic");
const ServerError = require("../errors/server-error");
const ErrorType = require("../errors/error-type");

async function getUserStoreActivity(request) {
  let userDetails = request.body
  let userDetailsToCheck = await usersLogic.extractUserDataFromCache(request);
  if (userDetailsToCheck != undefined && userDetailsToCheck.length > 0) {
    let customerRelevantInfo = await usersLogic.getUserId(userDetails)
    let getlastdateOfOrderServerResponse = await ordersDao.getLastOrderDate(customerRelevantInfo);
    let getLastDateOfCartResponseServer = await cartsDao.getCartCreatedDate(customerRelevantInfo);
    let customerId = [{ id: customerRelevantInfo[0].id }]
    let cartProducts = await cartsDao.getUserCartItems(customerId);
    let totalPrice = 0
    if (cartProducts.length > 0) {
      for (i = 0; i < cartProducts.length; i++) {
        totalPrice = totalPrice + cartProducts[i].total;
      }
    }
    return [getLastDateOfCartResponseServer, getlastdateOfOrderServerResponse, totalPrice];
  } else {
    console.warn(`[LOGIC_WARN] Unauthorized activity check attempt | User details missing in cache`);
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function getUserCartItems(request) {
  let userDetails = await usersLogic.extractUserDataFromCache(request);
  if (userDetails != undefined && userDetails.length > 0) {
    let customerInfo = request.body
    let customerRelevantInfo = await usersLogic.getUserId(customerInfo)
    let cartRelevantInfo = await cartsDao.getIdOfOpenedCart(customerRelevantInfo);
    let cartProducts = await cartsDao.getUserCartItems(customerRelevantInfo);
    
    console.log(`[LOGIC_EVENT] Fetching cart items | UserID: ${customerRelevantInfo[0].id}`);
    
    let totalInfoOfCart = [cartProducts, cartRelevantInfo];
    return totalInfoOfCart
  } else {
    console.warn(`[LOGIC_WARN] Attempt to fetch cart items without valid session`);
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function updateUserCartDetails(request) {
  let userDetails = request.body
  let userDetailsToCheck = await usersLogic.extractUserDataFromCache(request);
  if (userDetailsToCheck != undefined && userDetailsToCheck.length > 0) {
    let customerRelevantInfo = await usersLogic.getUserId(userDetails)
    let arrayOfOpenedCart = await cartsDao.getIdOfOpenedCart(customerRelevantInfo)
    if (arrayOfOpenedCart.length == 0) {
      console.log(`[LOGIC_EVENT] Initializing new cart | UserID: ${customerRelevantInfo[0].id}`);
      let updateUserCartDetailsResponseServer = await cartsDao.updateUserCartDetails(customerRelevantInfo);
      return updateUserCartDetailsResponseServer;
    }
    return arrayOfOpenedCart;
  } else {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function updateProductOnCartItems(request) {
  let productDetails = request.body
  let userDetails = await usersLogic.extractUserDataFromCache(request);
  if (userDetails != undefined && userDetails.length > 0) {
    console.log(`[LOGIC_EVENT] Product quantity update | CartID: ${productDetails.cart_id} | ProductID: ${productDetails.product_id}`);
    let updateProductResponseServer = await cartsDao.updateProductOnCartItems(productDetails);
    return updateProductResponseServer;
  } else {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function removeProductFromCartItem(request) {
  let productInfoOfCart = request.body
  let userDetails = await usersLogic.extractUserDataFromCache(request);
  if (userDetails != undefined && userDetails.length > 0) {
    console.log(`[LOGIC_EVENT] Product removal | User: ${userDetails[0].id} | ProductID: ${productInfoOfCart.product_id}`);
    let deleteServerResponse = await cartsDao.removeProductFromCartItem(productInfoOfCart);
    return deleteServerResponse;
  } else {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function deleteMyCartFromDB(request) {
  let cartInfo = request.body
  let userDetails = await usersLogic.extractUserDataFromCache(request);
  if (userDetails != undefined && userDetails.length > 0) {
    console.log(`[LOGIC_EVENT] Full cart clear | CartID: ${cartInfo.cart_id} | User: ${userDetails[0].id}`);
    let deleteServerResponse = await cartsDao.deleteItemsInCart(cartInfo);
    return deleteServerResponse;
  } else {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function addOrUpdateProductToCart(request) {
  let cartInfo = request.body
  let userDetails = await usersLogic.extractUserDataFromCache(request);
  if (userDetails != undefined && userDetails.length > 0) {
    let doWeHaveThisItemAlready = await cartsDao.doWeHaveThisItemAlready(cartInfo);
    if (doWeHaveThisItemAlready == false) {
      console.log(`[LOGIC_EVENT] Adding new item to cart | CartID: ${cartInfo[1][0].id}`);
      let addOrUpdateProductToCartServerResponse = await cartsDao.addThisItemToCart(cartInfo);
      return addOrUpdateProductToCartServerResponse;
    } else {
      console.log(`[LOGIC_EVENT] Updating existing item in cart | CartID: ${cartInfo[1][0].id}`);
      let addOrUpdateProductToCartServerResponse = await cartsDao.updateThisItemInCart(cartInfo);
      return addOrUpdateProductToCartServerResponse;
    }
  } else {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function getItemFromServerToDisplay(request) {
  let userDetails = await usersLogic.extractUserDataFromCache(request);
  let itemInfo = request.body;
  let openedCartInfoFromServer = await cartsDao.getOpenedCart(userDetails, itemInfo);
  let itemOfCartOpenedInfoFromServer = await cartsDao.getItemsOfOpenedCart(openedCartInfoFromServer, itemInfo);
  return itemOfCartOpenedInfoFromServer;
}

async function getIdOfOpenedCart(customerRelevantInfo) {
  let InfoOfOpenedCart = await cartsDao.getIdOfOpenedCart(customerRelevantInfo);
  return InfoOfOpenedCart;
}

async function getItemsOfCart(myCartDetails) {
  let openedCartInfoFromServer = await cartsDao.getItemsOfCart(myCartDetails);
  return openedCartInfoFromServer;
}

module.exports = {
  getUserStoreActivity,
  getUserCartItems,
  removeProductFromCartItem,
  deleteMyCartFromDB,
  addOrUpdateProductToCart,
  getIdOfOpenedCart,
  updateProductOnCartItems,
  updateUserCartDetails,
  getItemFromServerToDisplay,
  getItemsOfCart
};