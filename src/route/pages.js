const route = require("express").Router();

route.get("/login", (req, res) => {
  res.render("login", { title: "Login | Skydecor" });
});

route.get("/showroom", (req, res) => {
  res.render("showroom-form", { title: "Showroom | Skydecor" });
});

route.get("/event/place/:place", (req, res) => {
  const { place } = req.params;
  res.render("event-form", { title: "Event | Skydecor", place });
});

route.get("/event/thankyou/:place", (req, res) => {
  const { place } = req.params;
  res.render("thankyou/eventThankyouPage.ejs", {
    title: "Thank You | Skydecor",
    place,
  });
});

route.get("/event/already-submited/:place", (req, res) => {
  const { place } = req.params;
  res.render("thankyou/eventSubmited", {
    title: "Thank You | Skydecor",
    place,
  });
});

route.get("/showroom/thankyou", (req, res) => {
  res.render("thankyou/showroomThankyouPage.ejs", {
    title: "Thank You | Skydecor",
  });
});

route.get("/showroom/already-submited", (req, res) => {
  res.render("thankyou/showroomSubmited", { title: "Thank You | Skydecor" });
});

module.exports = route;
