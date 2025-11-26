const route = require("express").Router();

const { register, login } = require("../controller/user.controller.js");

route.post("/register", register);

route.post("/login", login);

module.exports = route;
