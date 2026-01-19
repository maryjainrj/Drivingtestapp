const User = require("../models/User");

module.exports = async (req, res) => {
  try {
    // Authentication is now handled by the examinerAuthMiddleware
    // So we can assume req.user is already available and valid
    
    // Initialize variables
    let message = null;
    const testType = req.query.testType || "";
    
    // Handle POST request (update test result)
    if (req.method === "POST") {
      const { userId, testResult } = req.body;
      if (userId) {
        const driverUser = await User.findById(userId);
        if (!driverUser || driverUser.userType !== "Driver") {
          message = { type: "danger", text: "User not found" };
        } else {
          driverUser.testResult = testResult || "Pending";
          await driverUser.save();
          message = { type: "success", text: "Test result updated successfully" };
        }
      }
    }
    
    // Set up query for fetching drivers
    const query = { userType: "Driver" };
    if (testType) {
      query.testType = testType;
    }
    
    // Fetch all drivers with their complete data
    const users = await User.find(query);
    
    // Debug logging
    if (users.length > 0) {
      console.log("Sample user car details:", users[0].car_details);
    }
    
    // Render the examiner page
    res.render("examiner", {
      user: req.user,
      users: users,
      testType: testType,
      message: message || (req.query.message ? { 
        type: req.query.message.includes("Error") ? "danger" : "success", 
        text: req.query.message 
      } : null)
    });
    
  } catch (error) {
    console.error("Error in examiner controller:", error);
    res.render("examiner", {
      user: req.user,
      users: [],
      testType: "",
      message: { type: "danger", text: "Error processing request" }
    });
  }
};