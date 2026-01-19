const Appointment = require('../models/appointment');
const User = require("../models/User");


module.exports = async (req, res, next) => {
    const userId = req.query.userId || req.body.userId;
    if (!userId) {
      return res.redirect("/login");
    }
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.render("login", {  error: { type: "warning", text: "User not found" }, 
        user: null });
      }
      req.user = user;
      next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      return res.render("login", {  error: { type: "danger", text: "Authentication error." },
         user: null });
    }
  };
//   module.exports = authMiddleware;  