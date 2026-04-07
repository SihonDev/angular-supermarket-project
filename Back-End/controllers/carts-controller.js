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
    // לוג עדכון פרטי עגלה
    console.log(`[CART_EVENT] Action: UpdateDetails | Status: Success`);
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
    const productId = request.body.productId || "unknown";
    let deleteServerResponse = await cartsLogic.removeProductFromCartItem(request);
    // לוג הסרת מוצר מהעגלה
    console.log(`[CART_EVENT] Action: RemoveProduct | ProductID: ${productId} | Status: Success`);
    response.json(deleteServerResponse);
  } catch (error) {
    return next(error);
  }
});

router.post("/deleteMyCartFromDB", async (request, response, next) => {
  try {
    let deleteCartServerResponse = await cartsLogic.deleteMyCartFromDB(request);
    // לוג מחיקת עגלה שלמה (אירוע משמעותי)
    console.log(`[CART_EVENT] Action: DeleteEntireCart | Status: Success`);
    response.json(deleteCartServerResponse);
  } catch (error) {
    return next(error);
  }
});

router.post("/addOrUpdateProductToCart", async (request, response, next) => {
  try {
    const { productId, quantity } = request.body;
    let addOrUpdateProductToCartServerResponse = await cartsLogic.addOrUpdateProductToCart(request);
    // לוג הוספת מוצר - חשוב לניטור עומסים
    console.log(`[CART_EVENT] Action: AddOrUpdateProduct | ProductID: ${productId} | Quantity: ${quantity} | Status: Success`);
    response.json(addOrUpdateProductToCartServerResponse);
  } catch (error) {
    console.error(`[CART_ERROR] Action: AddOrUpdateProduct | Error: ${error.message}`);
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