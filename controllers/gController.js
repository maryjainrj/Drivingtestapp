//fixed
const User = require("../models/User");
const Appointment = require("../models/appointment");

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

    const appointment = await Appointment.findOne({ userId: user._id });
    
    const availableAppointments = await Appointment.find({ isTimeSlotAvailable: true });

    res.render("g2", { 
      user,
      session: {
        user: user,
        appointment: appointment,
        selectedDate: ""
      },
      message: null,
      availableAppointments,
      appointment: appointment
    });
  } catch (error) {
    console.error("Error in G2 controller:", error);
    res.status(500).send("Internal Server Error");
  }
};