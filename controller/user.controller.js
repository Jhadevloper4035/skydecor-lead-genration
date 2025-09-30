const User = require("../model/user.model.js");
const { generateToken } = require("../middleware/jwt.js");

// Register
exports.register = async (req, res) => {
  const { name, password , accessType } = req.body;
  try {
    const userExists = await User.findOne({ name });
    if (userExists) {
      return res.redirect("/register?error=User already exists");
    }

    const user = await User.create({ name, password , accessType });
    const token = generateToken(user._id);

    // Store token in httpOnly cookie expire in 7 days 
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.redirect("/admin/dashboard");

  } catch (error) {
    return res.redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }
};

// Login
exports.login = async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.redirect("/admin/dashboard");
    } else {
      return res.redirect("/form/login");
    }

  } catch (error) {
    return res.redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
};
