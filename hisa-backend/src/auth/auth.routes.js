const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("./auth.controller");
const { authenticate } = require("./auth.middleware");

router.post("/register", register);
router.post("/login",    login);
router.get("/me",        authenticate, getProfile);

module.exports = router;
