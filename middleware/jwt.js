const jwt = require("jsonwebtoken");
const User = require("../model/user.model.js");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const protect = async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token) {
    return res.redirect("/login?error=Please login first");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.redirect("/login?error=Session expired, please login again");
  }
};


module.exports = { generateToken, protect };
