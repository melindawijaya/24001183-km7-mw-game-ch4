const express = require("express");
const router = express.Router();
const upload = require('../middeware/uploader')

const userController = require("../controller/userController");

// API for get all users data
router.get("/", userController.getAllUser);

// API for get user data by id
router.get("/:id", userController.getUserById);

// API for delete user data by id
router.delete("/:id", userController.deleteUserById);

// API for update data by id
router.patch("/:id", userController.UpdateUserById);

// API for create new user data
router.post("/", upload.single('photo'), userController.createUser);

module.exports = router;
