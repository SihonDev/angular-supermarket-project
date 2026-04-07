const express = require("express");
const productsLogic = require("../logic/products-logic");
const router = express.Router();

router.get("/getTheNumberOfProductsLeftInStock", async (request, response, next) => {
  try {
    let numberOfProductsLeftInStock = await productsLogic.getTheNumberOfProductsLeftInStock();
    response.json(numberOfProductsLeftInStock);
  } catch (error) {
    return next(error);
  }
});

router.get("/getAllProducts", async (request, response, next) => {
  try {
    let productsData = await productsLogic.getAllProducts(request);
    response.json(productsData);
  } catch (error) {
    return next(error);
  }
});

router.post("/addProduct", async (request, response, next) => {
  let productDetails = request.body
  let file = request.files
  let productTotalDetails = [productDetails, file, request]
  try {
    let productSuccessfullCreationData = await productsLogic.addProduct(productTotalDetails);
    
    // לוג אבטחה: הוספת מוצר חדש למערכת
    console.log(`[INVENTORY_EVENT] Action: AddProduct | Name: ${productDetails.name} | Price: ${productDetails.price} | Status: Success`);
    
    response.json(productSuccessfullCreationData);
  } catch (error) {
    console.error(`[INVENTORY_ERROR] Action: AddProduct | Error: ${error.message}`);
    return next(error);
  }
});

router.post("/updateProduct", async (request, response, next) => {
  let productDetails = request.body
  let file = request.files
  let productTotalDetails = [productDetails, file,request]
  try {
    let productSuccessfullUpdate = await productsLogic.updateProduct(productTotalDetails);
    
    // לוג אבטחה: עדכון מוצר קיים
    console.log(`[INVENTORY_EVENT] Action: UpdateProduct | ProductID: ${productDetails.id} | Status: Success`);
    
    response.json(productSuccessfullUpdate);
  } catch (error) {
    console.error(`[INVENTORY_ERROR] Action: UpdateProduct | Error: ${error.message}`);
    return next(error);
  }
});

router.post("/searchProduct", async (request, response, next) => {
  let productDetails = request.body
  try {
    let productsArray = await productsLogic.searchProduct(productDetails,request);
    
    // לוג חיפוש: עוזר לזהות מה לקוחות מחפשים או סריקות אוטומטיות
    console.log(`[SEARCH_EVENT] Query: ${productDetails.searchString || 'all'} | Results: ${productsArray.length}`);
    
    response.json(productsArray);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;