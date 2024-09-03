const express = require("express");

const router = express.Router();

const { authAdmin, authNormal } = require("../middleware/check-auth.js");

const OrdersController = require("../controllers/orders.js");

router.get("/", authAdmin, OrdersController.orders_get_all);

router.post("/", authNormal, OrdersController.orders_create_order);

module.exports = router;
