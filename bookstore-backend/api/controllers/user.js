const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            if (!req.body.email || !req.body.password) {
              return res.status(400).json({
                message: "Email and password are required",
              });
            }
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              fullName: req.body.fullName,
              isAdmin: false,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email, isAdmin: req.body.isAdmin || false })
    .exec()
    .then((users) => {
      if (users.length < 1) {
        // no user
        return res.status(401).json({
          message: "Auth failed", // ne pisemo da je fejlovao mejl, vec samo nesto, da se ne bi znalo sta
        });
      }
      bcrypt.compare(req.body.password, users[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: users[0].email,
              userId: users[0]._id,
              isAdmin: users[0].isAdmin,
              fullName: users[0].fullName,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
            user: {
              email: users[0].email,
              fullName: users[0].fullName,
              isAdmin: users[0].isAdmin,
            },
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      }); // jedino moze naci jednog korisnika, jer ne moze da se napravi vise naloga sa istim mejlom
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.deleteOne({ _id: req.params.userID })
    .exec()
    .then((result) => {
      res.status(204).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
