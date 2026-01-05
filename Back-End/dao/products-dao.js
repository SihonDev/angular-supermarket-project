const connection = require("./connection-wrapper");
const ServerError = require("./../errors/server-error");
const ErrorType = require("./../errors/error-type");

const uuid = require("uuid");
const fs = require("fs");

async function getTheNumberOfProductsLeftInStock() {
  let parameters = [];
  let sql = "SELECT * FROM products"
  try {
    let productsArray = await connection.executeWithParameters(sql, parameters);
    return productsArray.length
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function getAllProducts() {
  let sql = "SELECT * FROM supermarket.products;";
  let parameters = [];
  try {
    let productsData = await connection.executeWithParameters(sql, parameters);
    return productsData
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function addProduct(productTotalDetails) {
  let productDetails = productTotalDetails[0]
  let fileDetails = productTotalDetails[1]
  if (fileDetails != undefined && fileDetails != null) {
    let file = fileDetails.file
    const extension = file.name.substr(file.name.lastIndexOf("."));
    let newUuidFileName = uuid.v4();
    let fileNameWithExtension = newUuidFileName + extension
    file.mv("./uploads/" + fileNameWithExtension);
    productDetails.urlPath = fileNameWithExtension;
  }
  let sql = "INSERT INTO products (productName, categoryId, price,pictureRoute)  values(?, ?, ?, ?)";
  let parameters = [
    productDetails.productName.toString(),
    Number(productDetails.category),
    Number(productDetails.productPrice),
    productDetails.urlPath.toString()
  ];
  try {
    let productSuccessfullCreationData = await connection.executeWithParameters(sql, parameters);
    return productSuccessfullCreationData
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function updateProduct(productTotalDetails) {
  let productDetails = productTotalDetails[0]
  let fileDetails = productTotalDetails[1]
  if (fileDetails != undefined && fileDetails != null) {
    let file = fileDetails.file
    const extension = file.name.substr(file.name.lastIndexOf("."));
    let newUuidFileName = uuid.v4();
    let fileNameWithExtension = newUuidFileName + extension
    file.mv("./uploads/" + fileNameWithExtension);
    productDetails.urlPath = fileNameWithExtension;
  }
  let sql = "UPDATE products set productName=?, categoryId=?, price=?,pictureRoute=? where id=?"
  let parameters = [
    productDetails.productName,
    productDetails.category,
    productDetails.productPrice,
    productDetails.urlPath,
    productDetails.productId
  ];
  try {
    let productSuccessfulUpdate = await connection.executeWithParameters(sql, parameters);
    return productSuccessfulUpdate
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function searchProduct(productDetails) {
  let parameters = [productDetails.productName];
  let sql1 = "SELECT * FROM products where productName like "
  let sql2 = "'%" + parameters[0]
  let sql3 = "%'"
  let sql = sql1 + sql2 + sql3
  try {
    let productsArray = await connection.executeWithParameters(sql, parameters);
    return productsArray
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

module.exports = {
  getTheNumberOfProductsLeftInStock,
  getAllProducts,
  addProduct,
  updateProduct,
  searchProduct,
};