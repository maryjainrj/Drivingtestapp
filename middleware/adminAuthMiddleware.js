const Appointment = require('../models/appointment');
const User = require("../models/User");
const authMiddleware = require("./authMiddleware"); 


module.exports = async (req, res, next) => {
    await authMiddleware(req, res, async () => {
      if (req.user.userType !== "Admin") {
        return res.render("error", { message: "Access Denied: Only Admin allowed", user: req.user });
      }
      next();
    });
  };

  // module.exports = adminAuthMiddleware;