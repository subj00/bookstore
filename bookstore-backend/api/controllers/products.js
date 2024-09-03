const Product = require('../models/product.js');
const Author = require('../models/author.js');
const mongoose = require('mongoose');
const author = require('../models/author.js');

exports.products_get_all = (req, res, next) => {
  const perPage = 5; // broj proizvoda po stranici
  const page = req.body.page || 1;
  // trenutna stranica (podrazmevana je prva)

  Product.find()
    // .sort({ _id: -1 }) // soritiranje po opadajucem redosledu ID-a (najnoviji je prvi)
    // .skip((page - 1) * perPage) // preskakanje proizvoda na prethodnim stranicama
    // .limit(perPage) // uzima samo odredjeni broj proizvoda
    .select('name price year author _id imgUrl') // da nam ne bi slao __v sto je interni property
    .populate('author', 'firstName lastName')
    .exec()
    .then((docs) => {
      if (docs.length === 0) {
        return res.status(404).json({
          message: 'No products found',
        });
      }
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            year: doc.year,
            imgUrl: doc.imgUrl,
            author: doc.author
              ? `${doc.author.firstName} ${doc.author.lastName}`
              : null,
            _id: doc._id,
            request: {
              type: 'GET',
              url: `http://localhost:3000/products/${doc._id}`,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.products_create_product = (req, res, next) => {
  if (!req.body.name || !req.body.price || !req.body.year || !req.body.author) {
    return res.status(400).json({
      message: 'Missing required fields: _name, price, year, author',
    });
  }
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    year: req.body.year,
    author: req.body.author,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'Created product succesfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          year: result.year,
          author: req.body.author,
          _id: result.id,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${result._id}`,
          },
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Invalid data provided' });
      }
      return res.status(500).json({ error: err });
    });
};

exports.products_get_product = (req, res, next) => {
  const id = req.params.productID;
  Product.findById(id)
    .select('name price year author _id imgUrl')
    .populate('author', 'firstName lastName')
    .exec()
    .then((doc) => {
      console.log('From database', doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products',
          },
        });
      } else {
        res
          .status(404)
          .json({ message: 'No valid entry found for provided ID' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_update_product = (req, res, next) => {
  const id = req.params.productID;
  const body = req.body;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({ message: 'No update fields provided' });
  }

  Product.updateMany(
    { _id: id },
    {
      $set: body,
    }
  )
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${id}`,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Invalid data provided' });
      }
      return res.status(500).json({ error: err });
    });
};

exports.products_delete_product = (req, res, next) => {
  const id = req.params.productID;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(204).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products',
          body: {
            name: 'String',
            price: 'Number',
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.products_get_by_author = (req, res, next) => {
  if (!req.body.firstName || !req.body.lastName) {
    return res.status(400).json({
      message: 'Missing required fields: firstName and lastName',
    });
  }

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  Author.find({ firstName: firstName, lastName: lastName })
    .then((authors) => {
      if (!authors || authors.length === 0) {
        return res.status(404).json({ message: 'Author not found' });
      }

      const authorIDs = authors.map((author) => author._id);

      Product.find({ author: { $in: authorIDs } })
        .select('_name price year _id author')
        .populate('author', 'firstName lastName yearOfBirth')
        .exec()
        .then((docs) => {
          const response = {
            count: docs.length,
            products: docs.map((doc) => {
              return {
                _name: doc._name,
                price: doc.price,
                year: doc.year,
                _id: doc._id,
                author: `${doc.author.firstName} ${doc.author.lastName} (year of birth: ${doc.author.yearOfBirth})`,
                request: {
                  type: 'GET',
                  url: `http://localhost:3000/products/${doc._id}`,
                },
              };
            }),
          };
          res.status(200).json(response);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Invalid data provided' });
      }
      return res.status(500).json({ error: err });
    });
};
