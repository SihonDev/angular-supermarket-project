const express = require("express");
const cartsLogic = require("../logic/carts-logic");
const router = express.Router();

router.post("/getUserStoreActivity", async (request, response, next) => {
  try {
    let getThisRelevantUserDetailsServerResponse = await cartsLogic.getUserStoreActivity(request);
    response.json(getThisRelevantUserDetailsServerResponse);
  } catch (error) {
    return next(error);
  }
});

router.post("/getUserCartItems", async (request, response, next) => {
  try {
    let cartProducts = await cartsLogic.getUserCartItems(request);
    for (i = 0; i < cartProducts[0].length; i++) {
      cartProducts[0][i].quantityForUpdate = cartProducts[0][i].quantity
    }
    response.json(cartProducts);
  } catch (error) {
    return next(error);
  }
});

router.post("/updateUserCartDetails", async (request, response, next) => {
  try {
    let updateUserCartDetailsServerResponse = await cartsLogic.updateUserCartDetails(request);
    response.json(updateUserCartDetailsServerResponse);
  } catch (error) {
    return next(error);
  }
});

router.post("/updateProductOnCartItems", async (request, response, next) => {
  try {
    let updateProductToBuyFromCartServerResponse = await cartsLogic.updateProductOnCartItems(request);
    response.json(updateProductToBuyFromCartServerResponse);
  } catch (error) {
    return next(error);
  }
});

router.post("/removeProductFromCartItem", async (request, response, next) => {
  try {
    let deleteServerResponse = await cartsLogic.removeProductFromCartItem(request);
    response.json(deleteServerResponse);
  } catch (error) {
    return next(error);
  }
});

router.post("/deleteMyCartFromDB", async (request, response, next) => {
  try {
    let deleteCartServerResponse = await cartsLogic.deleteMyCartFromDB(request);
    response.json(deleteCartServerResponse);
  } catch (error) {
    return next(error);
  }
});

router.post("/addOrUpdateProductToCart", async (request, response, next) => {
  try {
    let addOrUpdateProductToCartServerResponse = await cartsLogic.addOrUpdateProductToCart(request);
    response.json(addOrUpdateProductToCartServerResponse);
  } catch (error) {
    return next(error);
  }
});

router.post("/getItemFromServerToDisplay", async (request, response, next) => {
  try {
    let itemOfCartOpenedInfoFromServer = await cartsLogic.getItemFromServerToDisplay(request);
    response.json(itemOfCartOpenedInfoFromServer);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;