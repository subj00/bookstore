const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const { authAdmin, authNormal } = require("../middleware/check-auth.js");

const ProductsController = require("../controllers/products.js");

router.get("/", ProductsController.products_get_all);
router.post("/", authAdmin, ProductsController.products_create_product);
router.get("/:productID", ProductsController.products_get_product);
router.patch(
  "/:productID",
  authAdmin,
  ProductsController.products_update_product
);
router.delete(
  "/:productID",
  authAdmin,
  ProductsController.products_delete_product
);

router.post("/by-author", ProductsController.products_get_by_author);

module.exports = router;
