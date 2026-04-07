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
        console.error(`[DB_ERROR] Method: getTheNumberOfProductsLeftInStock | Error: ${error.message}`);
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
        console.error(`[DB_ERROR] Method: getAllProducts | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function addProduct(productTotalDetails) {
    let productDetails = productTotalDetails[0]
    let fileDetails = productTotalDetails[1]
    
    if (fileDetails != undefined && fileDetails != null) {
        try {
            let file = fileDetails.file
            const extension = file.name.substr(file.name.lastIndexOf("."));
            let newUuidFileName = uuid.v4();
            let fileNameWithExtension = newUuidFileName + extension
            file.mv("./uploads/" + fileNameWithExtension);
            productDetails.urlPath = fileNameWithExtension;
            console.log(`[FILE_EVENT] Product image uploaded | FileName: ${fileNameWithExtension}`);
        } catch (fileError) {
            console.error(`[FILE_ERROR] Failed to move uploaded file | Error: ${fileError.message}`);
        }
    }

    let sql = "INSERT INTO products (productName, categoryId, price,pictureRoute)  values(?, ?, ?, ?)";
    let parameters = [
        productDetails.productName.toString(),
        Number(productDetails.category),
        Number(productDetails.productPrice),
        productDetails.urlPath ? productDetails.urlPath.toString() : ""
    ];

    try {
        let productSuccessfullCreationData = await connection.executeWithParameters(sql, parameters);
        console.log(`[DB_EVENT] Action: AddProduct | Name: ${productDetails.productName} | Price: ${productDetails.productPrice}`);
        return productSuccessfullCreationData
    } catch (error) {
        console.error(`[DB_ERROR] Method: addProduct | Name: ${productDetails.productName} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function updateProduct(productTotalDetails) {
    let productDetails = productTotalDetails[0]
    let fileDetails = productTotalDetails[1]

    if (fileDetails != undefined && fileDetails != null) {
        try {
            let file = fileDetails.file
            const extension = file.name.substr(file.name.lastIndexOf("."));
            let newUuidFileName = uuid.v4();
            let fileNameWithExtension = newUuidFileName + extension
            file.mv("./uploads/" + fileNameWithExtension);
            productDetails.urlPath = fileNameWithExtension;
            console.log(`[FILE_EVENT] Product image updated | FileName: ${fileNameWithExtension}`);
        } catch (fileError) {
            console.error(`[FILE_ERROR] Failed to update file | Error: ${fileError.message}`);
        }
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
        console.log(`[DB_EVENT] Action: UpdateProduct | ProductID: ${productDetails.productId} | NewPrice: ${productDetails.productPrice}`);
        return productSuccessfulUpdate
    } catch (error) {
        console.error(`[DB_ERROR] Method: updateProduct | ProductID: ${productDetails.productId} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function searchProduct(productDetails) {
    let parameters = [productDetails.productName];
    let sql = "SELECT * FROM products where productName like ?"
    let searchParam = "%" + parameters[0] + "%";
    
    try {
        // שים לב: תיקנתי כאן את השאילתה לשימוש בפרמטרים בטוחים נגד SQL Injection
        let productsArray = await connection.executeWithParameters(sql, [searchParam]);
        return productsArray
    } catch (error) {
        console.error(`[DB_ERROR] Method: searchProduct | Query: ${productDetails.productName} | Error: ${error.message}`);
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