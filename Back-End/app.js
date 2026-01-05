const usersController = require("./controllers/users-controller");
const cartsController = require("./controllers/carts-controller");
const ordersController = require("./controllers/orders-controller");
const productsController = require("./controllers/products-controller");
const errorHandler = require("./errors/error-handler");

const express = require("express");
const expressServer = express();

const fs = require("fs");
const fileUpload = require("express-fileupload");
const cors = require('cors'); // העברתי את ה-require ללמעלה לסדר טוב יותר

// יצירת תיקיית העלאות אם לא קיימת
if (!fs.existsSync("./uploads")) { 
    fs.mkdirSync("./uploads");
}

const port = process.env.PORT || 3001;

// הגדרות Middleware
expressServer.use(express.json());

// תיקון CORS: מאפשר לכל מקור (Dynamic IP) לגשת עם Credentials
expressServer.use(cors({
    origin: true, 
    credentials: true
}));

expressServer.use(fileUpload());
expressServer.use(express.static('./uploads'));

// הגדרת Routes
expressServer.use("/users", usersController);
expressServer.use("/carts", cartsController);
expressServer.use("/orders", ordersController);
expressServer.use("/products", productsController);

// טיפול בשגיאות (חייב להיות בסוף)
expressServer.use(errorHandler);

// הפעלת השרת על הפורט הנכון
expressServer.listen(port, () => console.log('Server started on port ' + port));