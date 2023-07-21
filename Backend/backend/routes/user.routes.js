const express = require("express");
const { register, login } = require("../controllers/user.controllers");
const router = express.Router();

//Auth
router.post("/register", register);
router.post("/login", login);

module.exports = router