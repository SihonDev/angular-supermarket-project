const productsDao = require("../dao/products-dao");
const ServerError = require("../errors/server-error");
const ErrorType = require("../errors/error-type");
const cacheModule = require("./cache-module");
const usersLogic = require("../logic/users-logic");

async function getTheNumberOfProductsLeftInStock() {
  let numberOfProductsLeftInStock = await productsDao.getTheNumberOfProductsLeftInStock();
  return numberOfProductsLeftInStock;
}

async function getAllProducts(request) {
  let productsData = await productsDao.getAllProducts(request);
  return productsData;
}

async function addProduct(productTotalDetails) {
  let userDetails = await usersLogic.extractUserDataFromCache(productTotalDetails[2]);
  if (userDetails != undefined && userDetails.length > 0) {

    let productSuccessfullCreationData = await productsDao.addProduct(productTotalDetails);
    return productSuccessfullCreationData;
  } else {
    throw new ServerError(ErrorType.GENERAL_ERROR);

  }
}

async function updateProduct(productTotalDetails) {
  let userDetails = await usersLogic.extractUserDataFromCache(productTotalDetails[2]);
  if (userDetails != undefined && userDetails.length > 0) {

    let productSuccessfullUpdate = await productsDao.updateProduct(productTotalDetails);
    return productSuccessfullUpdate;
  } else {
    throw new ServerError(ErrorType.GENERAL_ERROR);

  }
}

async function searchProduct(productDetails, request) {
  let userDetails = await usersLogic.extractUserDataFromCache(request);
  if (userDetails != undefined && userDetails.length > 0) {
    let productsArray = await productsDao.searchProduct(productDetails);
    return productsArray;
  } else {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

module.exports = {
  getTheNumberOfProductsLeftInStock,
  getAllProducts,
  addProduct,
  updateProduct,
  searchProduct
};