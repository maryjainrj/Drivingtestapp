//fixed
const Appointment = require('../models/appointment');
const User = require("../models/User");

const cancelbookingController = async (req, res) => {
  try {
    //login check
    if (!req.session.userId) {
      return res.redirect("/login");
    }
    
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy();
      return res.redirect("/login");
    }
    
    const userId = user._id; //  session userid
    
    // find and cancel
    const appointment = await Appointment.findOne({ userId });
    
    if (appointment) {
      appointment.userId = null;  
      appointment.isTimeSlotAvailable = true;
      await appointment.save();
    }
//fetch all available    
    const availableAppointments = await Appointment.find({ isTimeSlotAvailable: true });
    
    res.render("g2", {
      user, 
      message: { type: "success", text: "Appointment cancelled successfully" },
      appointment: null,      
      availableAppointments,
      selectedDate: '',
      session: {
        user: user,
        appointment: null,
        selectedDate: ''
      }
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    
    let user = null;
    try {
      if (req.session && req.session.userId) {
        user = await User.findById(req.session.userId);
      }
    } catch (userError) {
      console.error("Error fetching user:", userError);
    }
    
    res.render("g2", {
      message: { type: "danger", text: "Failed to cancel the appointment" },
      user: user,
      appointment: null,
      availableAppointments: [],
      session: {
        user: user,
        appointment: null,
        selectedDate: ''
      }
    });
  }
};

module.exports = cancelbookingController;