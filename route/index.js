const {
  submitFormEvent,
  submitFormShowroom,
  getEventAllLead,
  getShowroomAllLead,
} = require("../controller/index.js");
const route = require("express").Router();

route.post("/event/contact-form-submit", submitFormEvent);
route.post("/showroom/contact-form-submit", submitFormShowroom);

route.get("/event/get", getEventAllLead);

route.get("/showroom/get", getShowroomAllLead);

module.exports = route;
