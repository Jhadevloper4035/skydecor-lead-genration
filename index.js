require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const { ConnectDB, closeDB } = require("./config/db.js");
const port = process.env.PORT || 8000;

const formRoute = require("./route/index.js");
const pageRoute = require("./route/pages.js")
const userRoute = require("./route/user.js")
const adminRoute = require("./route/admin.js")




const app = express();

// Connect to DB before starting server
ConnectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/lead", formRoute);
app.use("/form", pageRoute);
app.use("/user", userRoute);
app.use("/admin",adminRoute);


// close db
process.on("SIGINT", async () => {
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeDB();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`✅ Server is running on port: ${port}`);
});
