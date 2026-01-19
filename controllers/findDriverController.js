//fixed
const User = require("../models/User");

module.exports = async (req, res) => {
  try {
    
    if (!req.session.userId) {
      return res.redirect("/login"); 
    }

    const user = await User.findById(req.session.userId);
    
    if (!user) {
      req.session.destroy(); 
      return res.redirect("/login");
    }

    res.render("g", { user, message: null });
  } catch (error) {
    console.error("Error Fetching User:", error);
    res.status(500).send("Internal Server Error");
  }
};
