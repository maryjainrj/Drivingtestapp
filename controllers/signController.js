//fixed
const User = require("../models/User");

module.exports = async (req, res) => {
  try {
    const { username, password, confirmPassword, userType } = req.body;

    if (!username || !password || !confirmPassword || !userType) {
      return res.render("signup", { 
        error: "All fields are required", 
        user: null 
      });
    }

    if (password !== confirmPassword) {
      return res.render("signup", { 
        error: "Passwords do not match", 
        user: null 
      });
    }

    const validUserTypes = ["Driver", "Examiner", "Admin"];
    if (!validUserTypes.includes(userType)) {
      return res.render("signup", { 
        error: "Invalid user type", 
        user: null 
      });
    }

    const existingUser = await User.findOne({ username }); 
    if (existingUser) {
      return res.render("signup", { 
        error: "Username already exists", 
        user: null 
      });
    }

    const newUser = new User({
      username,
      password,
      userType
    });

    await newUser.save();

    return res.render("login", {
      error: null,
      user: null,
      success: "Account created successfully. Please login.",
      session: {
        user: null
      }
    });
    
  } catch (error) {
    console.error("Error creating user:", error);
    res.render("signup", { 
      error: "Error creating account", 
      user: null 
    });
  }
};
