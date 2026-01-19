//fixed
const User = require("../models/User");
const Appointment = require("../models/appointment");

module.exports = async (req, res) => {
  try {
    const { 
      firstname, lastname, licenseNumber, age,testType,
      carMake, carModel, carYear, carPlate,
      appointmentId, date  
    } = req.body;

    if (!req.session.userId) {
      return res.redirect("/login");
    }

    const userId = req.session.userId;

    if (
      !firstname || !lastname || !licenseNumber || !age ||!testType ||
      !carMake || !carModel || !carYear || !carPlate || !appointmentId
    ) {
      const availableAppointments = await Appointment.find({ isTimeSlotAvailable: true });
      return res.render("g2", {
        user: req.session.user,
        message: { type: "danger", text: "Please fill all required fields and select an appointment" },
        availableAppointments,
        selectedDate: ''
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.render("error", { message: "The user is not available" });
    }

    user.firstname = firstname;
    user.lastname = lastname;
    user.licenseNumber = licenseNumber;
    user.age = age;
    user.testType = testType; //new addition as part of group project
    user.car_details = { carMake, carModel, carYear, carPlate };
    user.appointmentId = appointmentId; 
    user.appointmentDate = date;         

   // In newuserController.js
const appointment = await Appointment.findById(appointmentId);

if (!appointment || !appointment.isTimeSlotAvailable) {
  const availableAppointments = await Appointment.find({ isTimeSlotAvailable: true });
  return res.render("g2", {
    user: req.session.user,
    message: { type: "danger", text: "Selected appointment is not available" },
    availableAppointments,
    selectedDate: '',
  });
}

// Set the createdBy and userId fields
appointment.isTimeSlotAvailable = false; // Mark as booked
appointment.userId = userId; // Associate with the user
appointment.createdBy = userId; // Set createdBy to the authenticated user

// Save user and appointment data
await Promise.all([user.save(), appointment.save()]);

    return res.redirect(`/g?userId=${user._id}`);
  } catch (error) {
    console.error("Error in G2 submit:", error);
    const availableAppointments = await Appointment.find({ isTimeSlotAvailable: true });
    return res.render("g2", {
      user: req.session.user,
      // testtype: req.session.user..
      message: { type: "danger", text: "Error booking appointment" },
      availableAppointments,
      selectedDate: ''
    });
  }
};
