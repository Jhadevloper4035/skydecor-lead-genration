const { submitFormEvent, submitFormShowroom} = require("../controller/index.js");

const route = require("express").Router();
route.post("/event/contact-form-submit/:place", submitFormEvent);
route.post("/showroom/contact-form-submit", submitFormShowroom);

module.exports = route;
