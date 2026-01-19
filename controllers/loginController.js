const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation - check if username and password were provided
    if (!username || !password) {
      return res.render("login", {
        error: "Please enter both username and password",
        user: null
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      // Username doesn't exist
      return res.render("login", {
        error: "Username does not exist",
        user: null
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("login", {
        error: "Password is incorrect",
        user: null
      });
    }

    // Set session data
    req.session.userId = user._id;
    req.session.userType = user.userType;

    // Redirect based on user type
    switch (user.userType) {
      case "Admin":
        return res.redirect("/appointment");
      case "Driver":
        return res.redirect("/g2");
      case "Examiner":
        return res.redirect("/examiner");
      default:
        return res.redirect("/home");
    }

  } catch (error) {
    console.error("Login error:", error);
    return res.render("login", {
      error: "Invalid login credentials. Please try again.",
      user: null
    });
  }
};
