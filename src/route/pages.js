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

route.get("/event/thankyou", (req, res) => {
  res.render("thankyou/eventThankyouPage.ejs", {
    title: "Thank You | Skydecor",
  });
});

route.get("/showroom/thankyou", (req, res) => {
  res.render("thankyou/showroomThankyouPage.ejs", {
    title: "Thank You | Skydecor",
  });
});

route.get("/event/already-submited", (req, res) => {
  res.render("thankyou/eventSubmited", { title: "Thank You | Skydecor" });
});

route.get("/showroom/already-submited", (req, res) => {
  res.render("thankyou/showroomSubmited", { title: "Thank You | Skydecor" });
});

module.exports = route;
