const Author = require("../models/author.js");
const mongoose = require("mongoose");

exports.authors_get_all = (req, res, next) => {
  Author.find()
    .select("firstName lastName yearOfBirth nationality _id") 
    .exec()
    .then((docs) => {
      if (docs.length === 0) {
        return res.status(404).json({
          message: "No authors found",
        });
      }
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            firstName: doc.firstName,
            lastName: doc.lastName,
            yearOfBirth: doc.yearOfBirth,
            nationality: doc.nationality,
            _id: doc._id,
            request: {
              type: "GET",
              url: `http://localhost:3000/authors/${doc._id}`,
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

exports.auhtors_create_author = (req, res, next) => {
  const { firstName, lastName, yearOfBirth, nationality } = req.body;

  if (!firstName || !lastName || !nationality) {
    return res.status(400).json({ message: "Missing required data" });
  }

  const author = new Author({
    _id: new mongoose.Types.ObjectId(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    yearOfBirth: req.body.yearOfBirth,
    nationality: req.body.nationality,
  });
  author
    .save() // mongoose obezbedjuje ovu metodu, kao bi se proizvod cuvao u bazi, vraca promise
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created author succesfully",
        createdAuthor: {
          firstName: result.firstName,
          lastName: result.lastName,
          yearOfBirth: result.yearOfBirth,
          nationality: result.nationality,
          _id: result.id,
          request: {
            type: "GET",
            url: `http://localhost:3000/authors/${result._id}`,
          },
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

exports.author_get_author = (req, res, next) => {
  const id = req.params.authorID;
  Author.findById(id)
    .select("firstName lastName yearOfBirth nationality _id")
    .exec()
    .then((doc) => {
      console.log("From database", doc);

      if (doc) {
        res.status(200).json({
          author: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/authors",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.authors_update_author = (req, res, next) => {
  const id = req.params.authorID;
  const body = req.body;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({ message: "No update fields provided" });
  }

  Author.updateOne(
    { _id: id },
    {
      $set: body,
    }
  )
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Author updated",
        request: {
          type: "GET",
          url: `http://localhost:3000/authors/${id}`,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: "Invalid data provided" });
      }
      return res.status(500).json({ error: err });
    });
};

exports.authors_delete_author = (req, res, next) => {
  const id = req.params.authorID;
  Author.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Author not found" });
      }
      res.status(204).json({
        message: "Author deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/authors",
          body: {
            firstName: "String",
            lastName: "String",
            yearOfBirth: "Number",
            nationality: "String",
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
