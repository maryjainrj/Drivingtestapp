const Appointment = require('../models/appointment');
const User = require("../models/User");
const authMiddleware = require("./adminAuthMiddleware"); 

module.exports  = async (req, res, next) => {
    await authMiddleware(req, res, async () => {
      if (req.user.userType !== "Driver") {
        return res.render("error", { message: "Access Denied: Only Drivers allowed", user: req.user });
      }
      next();
    });
  };
  
//   module.exports = driverAuthMiddleware;