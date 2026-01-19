//fixed
const User = require("../models/User");

module.exports = async (req, res) => {
  try {
    console.log(req.body, "inside update controller");

    const { carMake, carModel, carYear, carPlate } = req.body;

    if (!carMake || !carModel || !carYear || !carPlate) {
      return res.render("g", { 
        user: req.user,  
        message: { type: "danger", text: "All car fields are required!" }
      });
    }

    const userId = req.user._id; 
    const user = await User.findById(userId);

    if (!user) {
      return res.render("error", { message: "User not found" });
    }

    user.car_details = {
      carMake,
      carModel,
      carYear,
      carPlate
    };

    const updatedUser = await user.save();
    console.log("Car Details Updated:", updatedUser);

    return res.redirect(`/g?userId=${updatedUser._id}`);
  } catch (error) {
    console.error("Error updating car details:", error);
    return res.render("g", { 
      user: req.user,  
      message: { type: "danger", text: "Error updating car details" }
    });
  }
};
