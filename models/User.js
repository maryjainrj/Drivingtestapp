//fixed

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  firstname: { 
    type: String, 
    default: "" 
  },
  lastname: { 
    type: String, 
    default: "" 
  },
  licenseNumber: { 
    type: String, 
    default: "" 
  },
  age: { 
    type: Number, 
    default: 0 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true
  },
  
  userType: { 
    type: String, 
    enum: ["Driver", "Examiner", "Admin"], 
    required: true  },
    testType: { 
      type: String,
      enum: ["G", "G2"],
      
        },
    testResult: {
      type: String,
      enum: ["Pending", "Pass", "Fail"],
      default: "Pending"
        },
  car_details: {
    carMake: { type: String, default: "" },
    carModel: { type: String, default: "" },
    carYear: { type: Number, default: 0 },
    carPlate: { type: String, default: "" }
  },
  licenseReady: {
    type: String,
    enum: ['Yes', 'No', null],
    default: 'No'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }, // Store Appointment ID
  appointmentDate: { type: String } 
});

// Encrypt password before saving
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});



module.exports = mongoose.model("User", UserSchema);
