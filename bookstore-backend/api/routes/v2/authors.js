const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

// const checkAuth = require("../../middleware/check-auth.js");

const AuthorController = require("../../controllers/authors.js");

router.get("/", AuthorController.authors_get_all);

// router.post('/', checkAuth, AuthorController.auhtors_create_author);

router.get("/:authorID", AuthorController.author_get_author);

// router.patch("/:authorID", checkAuth, AuthorController.authors_update_author);

// router.delete("/:authorID", checkAuth, AuthorController.authors_delete_author);

module.exports = router;
