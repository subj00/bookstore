const Order = require("../models/order.js");
const Product = require("../models/product.js");
const mongoose = require("mongoose");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("products quantity _id date user")
    .sort({ date: -1 })
    // .populate("product", "name price")
    .exec()
    .then((docs) => {
      if (docs.length === 0) {
        return res.status(404).json({
          message: "No orders found",
        });
      }
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            products: doc.products,
            quantity: doc.quantity,
            date: doc.date,
            user: doc.user,
            request: {
              request: {
                type: "GET",
                url: `http://localhost:3000/orders/${doc._id}`,
              },
            },
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_create_order = (req, res, next) => {
  const products = req.body.products;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({
      message: "No products provided or invalid format",
    });
  }

  const productIds = products.map((p) => p._id);
  let productFound = false;
  Product.find({ _id: { $in: productIds } })
    .then((foundProducts) => {
      if (foundProducts.length !== products.length) {
        return res.status(404).json({
          message: "One or more products not found",
        });
      }

      // Create an array of orders

      const orderModel = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: products.reduce((acc, curr) => {
          acc += curr.quantity;
        }, 0),
        products: products,
        user: req.userData.fullName,
      });

      // Save all orders at once
      return orderModel.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          products: result.products,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          url: `http://localhost:3000/orders/${result._id}`,
        },
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: "Invalid data provided" });
      }
      return res.status(500).json({ error: err });
    });
};

exports.orders_get_order = (req, res, next) => {
  Order.findById(req.params.orderID)
    .populate({
      path: "product",
      select: "_name price year author",
      populate: {
        path: "author",
        select: "firstName lastName",
      },
    })
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_delete_order = (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderID })
    .exec()
    .then((resut) => {
      res.status(204).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          body: {
            productID: "ID",
            quantity: "Number",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
