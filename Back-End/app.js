const usersController = require("./controllers/users-controller");
const cartsController = require("./controllers/carts-controller");
const ordersController = require("./controllers/orders-controller");
const productsController = require("./controllers/products-controller");
const errorHandler = require("./errors/error-handler");

const express = require("express");
const expressServer = express();

const fs = require("fs");
const fileUpload = require("express-fileupload");
const cors = require('cors');

// --- שכבת ניטור SIEM (לוגים לספלאנק) ---
expressServer.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[ACCESS_LOG] Method: ${req.method} | Path: ${req.originalUrl} | Status: ${res.statusCode} | IP: ${req.ip} | Duration: ${duration}ms`);
    });
    next();
});
// --------------------------------------

if (!fs.existsSync("./uploads")) { 
    fs.mkdirSync("./uploads");
}

const port = process.env.PORT || 3001;

expressServer.use(express.json());

expressServer.use(cors({
    origin: true, 
    credentials: true
}));

expressServer.use(fileUpload());
expressServer.use(express.static('./uploads'));

expressServer.use("/users", usersController);
expressServer.use("/carts", cartsController);
expressServer.use("/orders", ordersController);
expressServer.use("/products", productsController);

expressServer.use(errorHandler);

expressServer.listen(port, () => console.log('Server started on port ' + port));