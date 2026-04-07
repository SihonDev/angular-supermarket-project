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
    // שליפת נתוני המשתמש מה-Cache (נמצא באינדקס 2 של המערך שנשלח)
    let userDetails = await usersLogic.extractUserDataFromCache(productTotalDetails[2]);
    
    if (userDetails != undefined && userDetails.length > 0) {
        console.log(`[LOGIC_EVENT] Admin action: Adding new product | User: ${userDetails[0].id} | Product: ${productTotalDetails[0].productName}`);
        let productSuccessfullCreationData = await productsDao.addProduct(productTotalDetails);
        return productSuccessfullCreationData;
    } else {
        console.error(`[AUTH_ALERT] Unauthorized attempt to add product!`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function updateProduct(productTotalDetails) {
    let userDetails = await usersLogic.extractUserDataFromCache(productTotalDetails[2]);
    
    if (userDetails != undefined && userDetails.length > 0) {
        console.log(`[LOGIC_EVENT] Admin action: Updating product | User: ${userDetails[0].id} | ProductID: ${productTotalDetails[0].productId}`);
        let productSuccessfullUpdate = await productsDao.updateProduct(productTotalDetails);
        return productSuccessfullUpdate;
    } else {
        console.error(`[AUTH_ALERT] Unauthorized attempt to update product!`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function searchProduct(productDetails, request) {
    let userDetails = await usersLogic.extractUserDataFromCache(request);
    
    if (userDetails != undefined && userDetails.length > 0) {
        // לוג חיפוש - עוזר להבין מה לקוחות מחפשים והאם יש סריקות חשודות
        console.log(`[LOGIC_EVENT] Product search | User: ${userDetails[0].id} | Term: ${productDetails.productName}`);
        let productsArray = await productsDao.searchProduct(productDetails);
        return productsArray;
    } else {
        console.warn(`[LOGIC_WARN] Search attempt without valid session`);
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