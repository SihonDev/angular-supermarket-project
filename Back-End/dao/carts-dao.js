const connection = require("./connection-wrapper");
const ServerError = require("./../errors/server-error");
const ErrorType = require("./../errors/error-type");
const moment = require('moment')

async function getCartCreatedDate(userDetails) {
    let sql = 'SELECT * FROM supermarket.carts where user_id=? and status=1 order by created_date desc';
    let parameters = [userDetails[0].id];
    try {
        let lastDatesOfOpenedCarts = await connection.executeWithParameters(sql, parameters);
        return lastDatesOfOpenedCarts
    } catch (error) {
        console.error(`[DB_ERROR] Method: getCartCreatedDate | UserID: ${userDetails[0].id} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function getUserCartItems(customerRelevantInfo) {
    let sql = "SELECT * From (select cart_item.product_id, cart_item.cart_id, cart_item.quantity, cart_item.total FROM supermarket.carts join cart_item on carts.id = cart_item.cart_id where carts.user_id = ? and carts.status = ?) as table1 join products on products.id = table1.product_id "
    let parameters = [customerRelevantInfo[0].id, 1];
    try {
        let cartData = await connection.executeWithParameters(sql, parameters);
        return cartData
    } catch (error) {
        console.error(`[DB_ERROR] Method: getUserCartItems | UserID: ${customerRelevantInfo[0].id} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function getIdOfOpenedCart(customerRelevantInfo) {
    let sql = 'SELECT * FROM supermarket.carts where user_id = ? and status=1'
    let parameters = [customerRelevantInfo[0].id];
    try {
        let cartDetails = await connection.executeWithParameters(sql, parameters);
        return cartDetails
    } catch (error) {
        console.error(`[DB_ERROR] Method: getIdOfOpenedCart | UserID: ${customerRelevantInfo[0].id} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function updateUserCartDetails(userDetails) {
    let sql = 'INSERT INTO  supermarket.carts (user_id,created_date,status) VALUES (?,?,?)';
    let parameters = [userDetails[0].id.toString(),
        moment().format('YYYY-MM-DD').toString(), 1
    ];
    try {
        let updateUserCartDetailsServerResponse = await connection.executeWithParameters(sql, parameters);
        console.log(`[DB_EVENT] Action: CreateCart | UserID: ${userDetails[0].id} | Status: Success`);
        return updateUserCartDetailsServerResponse
    } catch (error) {
        console.error(`[DB_ERROR] Method: updateUserCartDetails | UserID: ${userDetails[0].id} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function updateProductOnCartItems(productDetails) {
    let sql = 'UPDATE cart_item set quantity=?, total=? where product_id=? and cart_id=?';
    let parameters = [
        productDetails.quantityForUpdate,
        productDetails.quantityForUpdate * productDetails.price,
        productDetails.product_id,
        productDetails.cart_id
    ];
    try {
        let cartDetails = await connection.executeWithParameters(sql, parameters);
        console.log(`[DB_EVENT] Action: UpdateProductQuantity | CartID: ${productDetails.cart_id} | ProductID: ${productDetails.product_id} | NewQuantity: ${productDetails.quantityForUpdate}`);
        return cartDetails
    } catch (error) {
        console.error(`[DB_ERROR] Method: updateProductOnCartItems | CartID: ${productDetails.cart_id} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function removeProductFromCartItem(productInfoOfCart) {
    let sql = "DELETE FROM cart_item WHERE product_id=? and cart_id=?"
    let parameters = [productInfoOfCart.product_id, productInfoOfCart.cart_id];
    try {
        let deleteServerResponse = await connection.executeWithParameters(sql, parameters);
        console.log(`[DB_EVENT] Action: RemoveItem | CartID: ${productInfoOfCart.cart_id} | ProductID: ${productInfoOfCart.product_id}`);
        return deleteServerResponse
    } catch (error) {
        console.error(`[DB_ERROR] Method: removeProductFromCartItem | CartID: ${productInfoOfCart.cart_id} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function deleteItemsInCart(cartInfo) {
    let sql = "DELETE FROM cart_item WHERE cart_id=?"
    let parameters = [cartInfo.cart_id];
    try {
        let deleteServerResponse = await connection.executeWithParameters(sql, parameters);
        console.log(`[DB_EVENT] Action: ClearCartItems | CartID: ${cartInfo.cart_id}`);
        return deleteServerResponse
    } catch (error) {
        console.error(`[DB_ERROR] Method: deleteItemsInCart | CartID: ${cartInfo.cart_id} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function doWeHaveThisItemAlready(cartInfo) {
    let sql = "SELECT * FROM supermarket.cart_item where product_id=? and cart_id=? "
    let parameters = [cartInfo[0][0].id, cartInfo[1][0].id];
    try {
        let doWeHaveThisItemAlready = await connection.executeWithParameters(sql, parameters);
        return doWeHaveThisItemAlready.length != 0;
    } catch (error) {
        console.error(`[DB_ERROR] Method: doWeHaveThisItemAlready | CartID: ${cartInfo[1][0].id} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function addThisItemToCart(cartInfo) {
    let sql = "INSERT INTO cart_item (product_id,quantity, total, cart_id)  values(?, ?, ?, ?)"
    let parameters = [
        cartInfo[0][0].id,
        cartInfo[0][1].productQuantity,
        cartInfo[0][0].price * cartInfo[0][1].productQuantity,
        cartInfo[1][0].id
    ];
    try {
        let addServerResponse = await connection.executeWithParameters(sql, parameters);
        console.log(`[DB_EVENT] Action: AddItemToCart | CartID: ${cartInfo[1][0].id} | ProductID: ${cartInfo[0][0].id} | Qty: ${cartInfo[0][1].productQuantity}`);
        return addServerResponse
    } catch (error) {
        console.error(`[DB_ERROR] Method: addThisItemToCart | CartID: ${cartInfo[1][0].id} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function updateThisItemInCart(cartInfo) {
    let sql = 'UPDATE cart_item set quantity=?, total=? where product_id=? and cart_id=?';
    let parameters = [
        cartInfo[0][1].productQuantity,
        cartInfo[0][0].price * cartInfo[0][1].productQuantity,
        cartInfo[0][0].id,
        cartInfo[1][0].id
    ];
    try {
        let updateServerResponse = await connection.executeWithParameters(sql, parameters);
        console.log(`[DB_EVENT] Action: UpdateExistingItem | CartID: ${cartInfo[1][0].id} | ProductID: ${cartInfo[0][0].id}`);
        return updateServerResponse
    } catch (error) {
        console.error(`[DB_ERROR] Method: updateThisItemInCart | CartID: ${cartInfo[1][0].id} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function getOpenedCart(userDetails, itemInfo) {
    let sql = 'SELECT * FROM supermarket.carts where user_id=? and status=1';
    let parameters = [userDetails[0].id.toString()];
    try {
        let cartOpenedInfo = await connection.executeWithParameters(sql, parameters);
        return cartOpenedInfo
    } catch (error) {
        console.error(`[DB_ERROR] Method: getOpenedCart | UserID: ${userDetails[0].id} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function getItemsOfOpenedCart(userCartDetails, iteimInfo) {
    let sql = 'SELECT * FROM supermarket.cart_item where product_id=? and cart_id=?';
    let parameters = [iteimInfo.id, userCartDetails[0].id];
    try {
        let itemOfCartOpenedInfo = await connection.executeWithParameters(sql, parameters);
        return itemOfCartOpenedInfo
    } catch (error) {
        console.error(`[DB_ERROR] Method: getItemsOfOpenedCart | CartID: ${userCartDetails[0].id} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function getItemsOfCart(myCartDetails) {
    let sql = 'SELECT * FROM cart_item right join products on cart_item.product_id = products.id where cart_id=?'
    let parameters = [myCartDetails[0].cart_id];
    try {
        let itemOfCart = await connection.executeWithParameters(sql, parameters);
        return itemOfCart
    } catch (error) {
        console.error(`[DB_ERROR] Method: getItemsOfCart | CartID: ${myCartDetails[0].cart_id} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

async function deleteMyCartFromDB(cartInfo) {
    let sql = "DELETE FROM carts WHERE id=?"
    let parameters = [cartInfo.cart_id];
    try {
        let deleteServerResponse = await connection.executeWithParameters(sql, parameters);
        console.log(`[DB_EVENT] Action: DeleteCartFromDB | CartID: ${cartInfo.cart_id}`);
        return deleteServerResponse
    } catch (error) {
        console.error(`[DB_ERROR] Method: deleteMyCartFromDB | CartID: ${cartInfo.cart_id} | Error: ${error.message}`);
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}

module.exports = {
    getCartCreatedDate,
    getUserCartItems,
    removeProductFromCartItem,
    deleteItemsInCart,
    getIdOfOpenedCart,
    updateUserCartDetails,
    doWeHaveThisItemAlready,
    addThisItemToCart,
    updateThisItemInCart,
    getOpenedCart,
    getItemsOfOpenedCart,
    getItemsOfCart,
    updateProductOnCartItems,
    deleteMyCartFromDB
};