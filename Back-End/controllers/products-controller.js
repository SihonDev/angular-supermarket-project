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
    response.json(productSuccessfullCreationData);
  } catch (error) {
    return next(error);
  }
});

router.post("/updateProduct", async (request, response, next) => {
  let productDetails = request.body
  let file = request.files
  let productTotalDetails = [productDetails, file,request]
  try {
    let productSuccessfullUpdate = await productsLogic.updateProduct(productTotalDetails);
    response.json(productSuccessfullUpdate);
  } catch (error) {
    return next(error);
  }
});

router.post("/searchProduct", async (request, response, next) => {
  let productDetails = request.body
  try {
    let productsArray = await productsLogic.searchProduct(productDetails,request);
    response.json(productsArray);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;