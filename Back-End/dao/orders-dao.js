const connection = require("./connection-wrapper");
const ServerError = require("../errors/server-error");
const ErrorType = require("../errors/error-type");
const moment = require('moment')
const fs = require('fs');

async function getTheTotalNumberOfSubmittedOrders() {
  let parameters = [];
  let sql = "SELECT * FROM orders"
  try {
    let numberOfOrdersSubmitted = await connection.executeWithParameters(sql, parameters);
    return numberOfOrdersSubmitted.length
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function getCityNameFromServer(id) {
  let sql = "SELECT * FROM supermarket.users where id=?";
  let parameters = [id];
  try {
    let customerInfoFromServer = await connection.executeWithParameters(sql, parameters);
    return customerInfoFromServer
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function getStreetNameFromServer(id) {
  let sql = "SELECT * FROM supermarket.users where id=?"
  let parameters = [id];
  try {
    let customerInfoFromServer = await connection.executeWithParameters(sql, parameters);
    return customerInfoFromServer
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function sameDateShipeDate() {
  let sqlScript = "SELECT shipe_date ,COUNT(shipe_date) AS NumberOfDeliveries FROM orders group by shipe_date"
  let parameters = [];
  try {
    let countDatesFromServerArray = await connection.executeWithParameters(sqlScript, parameters);
    let invalidDatesFromServer = [];
    for (i = 0; i < countDatesFromServerArray.length; i++) {
      if (Number(countDatesFromServerArray[i].NumberOfDeliveries) >= 3) {
        invalidDatesFromServer.push(countDatesFromServerArray[i])
      }
    }
    return invalidDatesFromServer
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function getLastOrder(id) {
  let sql = 'SELECT * FROM supermarket.orders where user_id=? order by id desc';
  let parameters = [id];
  try {
    let lastOrder = await connection.executeWithParameters(sql, parameters);
    return lastOrder[0]
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function updateUserCartDetails(orderDetails) {
  let sql = "UPDATE carts set status=? where id=?";
  let parameters = [0,orderDetails[0].id];
  try {
    let updateUserCartDetailsResponseFromServer = await connection.executeWithParameters(sql, parameters);
    return updateUserCartDetailsResponseFromServer
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function insertOrderInServer(userDetails, generalOrderDetails, openedCartDetails, itemsOfCartDetails) {
  let sql = "INSERT INTO orders (user_id, cart_id, price, city,street,shipe_date,order_date,credit_card)  values(?, ?, ?, ?, ?,?,?,?)";
  let cartTotalPrice = calculateTotalPrice(itemsOfCartDetails)
  let parameters = [
    userDetails[0].id,
    openedCartDetails[0].id,
    cartTotalPrice,
    generalOrderDetails[0].city,
    generalOrderDetails[0].street,
    generalOrderDetails[0].shippingDate,
    moment().format('YYYY-MM-DD'),
    generalOrderDetails[0].creditCard
  ];
  let creditCardNumber = Number(generalOrderDetails[0].creditCard)
  let lastFourDigits = getFourDigits(creditCardNumber)
  let lasfourDigitsString = getlasfourDigitsString(lastFourDigits)
  parameters[7] = lasfourDigitsString
  try {
    let addOrderResponseFromServer = await connection.executeWithParameters(sql, parameters);
    return addOrderResponseFromServer
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

function calculateTotalPrice(itemsOfCart) {
  let totalPrice = 0
  for (let i = 0; i < itemsOfCart.length; i++) {
    totalPrice = totalPrice + itemsOfCart[i].total;
  }
  console.log("sihon" + totalPrice)
  return totalPrice
}

async function getLastOrderDate(userDetails) {
  let sql = 'SELECT * FROM supermarket.orders where user_id=? order by order_date desc';
  let parameters = [userDetails[0].id];
  try {
    let lastDateOfOrder = await connection.executeWithParameters(sql, parameters);
    return lastDateOfOrder
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
}

async function getReceipt(myCartDetails, userDetails, itemsOfCart) {
  let data = 'Reciept for customer: ' + userDetails[0].firstName + ' ' + userDetails[0].lastName + ' , id: ' + myCartDetails.user_id + '\n' + '\n' +
  'Shipping Details:' + '\n' +
  'City: ' + myCartDetails.city + ', Street: ' + myCartDetails.street + ', Shipping date: ' + moment(myCartDetails.shipe_date).format('DD-MM-YYYY') + '\n' + '\n' +
  'Products lists: ' + '\n' 
let totalPriceOfAllProduct = 0;
for (i = 0; i < itemsOfCart.length; i++) {
  data = data + 'Product Name: ' + itemsOfCart[i].productName + ', Quantity: ' + itemsOfCart[i].quantity + ', Price per unit/kg: ' + itemsOfCart[i].price +
    ', Total price of product ' + itemsOfCart[i].total + ' USD' + '\n'
  totalPriceOfAllProduct = totalPriceOfAllProduct + itemsOfCart[i].total
}
data = data + '\n' +  'Total price of all products: ' + totalPriceOfAllProduct.toFixed(2) + ' USD'
let fileName = "recieptForCart_" + myCartDetails.id + "_CustomerId_" + myCartDetails.user_id + "_ShippingDate_" + moment(myCartDetails.shipe_date).format('DD-MM-YYYY') + ".txt"

  let path = "./uploads/" + fileName;
  let path2 = "../Front-End/src/assets/"+fileName
  fs.writeFileSync(path, data);
  fs.writeFileSync(path2, data);
  let fileObj = {
    fileName: fileName
  }

  let sql = "update orders set reciept =? where id>0 and cart_id =?"
  let parameters = [ fileName, myCartDetails.cart_id];
  try {
    let serverResponseUpdateReceoptInOrder = await connection.executeWithParameters(sql, parameters);
  } catch (error) {
    throw new ServerError(ErrorType.GENERAL_ERROR);
  }
  return fileObj
}

function getFourDigits(number) {
  let lastFourDigits = 0;
  for (i = 0; i < 4; i++) {
    lastFourDigits = lastFourDigits + number % 10 * (Math.pow(10, i));
    number = number / 10;
    number = Math.trunc(number)
  }
  return lastFourDigits
}

function getlasfourDigitsString(number) {
  var count = 0;
  var numberClone = number
  if (numberClone >= 1) ++count;
  while (numberClone / 10 >= 1) {
    numberClone /= 10;
    ++count;
  }
  let lasfourDigitsString = number.toString()
  if (count==4){
    lasfourDigitsString = lasfourDigitsString;
  } else if (count == 3) {
    lasfourDigitsString = '0' + lasfourDigitsString;
  } else if (count == 2) {
    lasfourDigitsString = '00' + lasfourDigitsString;
  } else if (count == 1) {
    lasfourDigitsString = '000' + lasfourDigitsString;
  } else {
    lasfourDigitsString = '0000'
  }
  return lasfourDigitsString
}

module.exports = {
  getTheTotalNumberOfSubmittedOrders,
  getLastOrderDate,
  insertOrderInServer,
  updateUserCartDetails,
  calculateTotalPrice,
  getCityNameFromServer,
  getStreetNameFromServer,
  getReceipt,
  getLastOrder,
  getlasfourDigitsString,
  getFourDigits,
  sameDateShipeDate,
};