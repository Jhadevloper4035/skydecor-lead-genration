const route = require("express").Router();

route.get("/showroom", (req, res) => {
  res.render("showroom-form", { title: "Showroom | Skydecor" });
});

route.get("/event", (req, res) => {
  res.render("event-form", { title: "Event | Skydecor" });
});

route.get("/login", (req, res) => {
  res.render("login", { title: "Login | Skydecor" });
});

route.get("/thankyou", (req, res) => {
  res.render("thankyou", { title: "Thank You | Skydecor" });
});

module.exports = route;
