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
    return res.redirect("/form/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    
    next();
  } catch (error) {
    return res.redirect("/form/login");
  }
};

const websitleadAcess = async(req,res,next) => {
  const {accessType} = req.user
 console.log(accessType)
  if(accessType === "showroom" ){
    return res.status(403).json({
      message : "Inavlid acess Type "
    })
  }

  next();
}

const showroomLeadAcess = async(req,res , next) => {
  const {accessType} = req.user

  if(accessType === "website" ){
    return  res.render("adminDashboard/errorHandling.ejs", { title: "Thank You | Skydecor" , message : "Invalid Access Type" , user : req.user });
  }
  next();
}

const adminLeadAcess = async(req,res , next) => {
  const {accessType} = req.user

  if(accessType === "showroom" || accessType ==="website" ){
    return  res.render("adminDashboard/errorHandling.ejs", { title: "Thank You | Skydecor" , message : "Invalid Access Type" , user : req.user });
  }
  next();
}


module.exports = { generateToken, protect , websitleadAcess , showroomLeadAcess , adminLeadAcess };
