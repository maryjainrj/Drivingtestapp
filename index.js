// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Import Mongoose models
const User = require("./models/User");
const Appointment = require("./models/appointment");

const app = express();
const PORT = 4001;

// Import Controllers
const loginController = require("./controllers/loginController");
const signController = require("./controllers/signController");
const updateController = require("./controllers/updateController");
const newuserController = require("./controllers/newuserController");
const homeController = require("./controllers/homeController");
const appointmentController = require("./controllers/appointmentController");
const cancelbookingController = require("./controllers/cancelbookingController");
const examinerController = require("./controllers/examinerController"); // Examiner route controller

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://admin:admin@cluster0.cc8z9.mongodb.net/drivers_database?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => console.error("DB Connection Error:", err));

// Configure session with MongoDB 
app.use(
  session({
    secret: "lostandfound11",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://admin:admin@cluster0.cc8z9.mongodb.net/drivers_database",
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
      httpOnly: true,
    },
  })
);

// Middleware setup
app.use(express.static(path.join(__dirname, "public"))); 
app.set("view engine", "ejs"); 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


// general authentication middleware
const authMiddleware = async (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy();
      return res.render("login", { error: "User not found", user: null });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.render("login", { error: "Authentication error", user: null });
  }
};

// Driver-only route middleware
const driverAuthMiddleware = async (req, res, next) => {
  await authMiddleware(req, res, async () => {
    if (req.user.userType !== "Driver") {
      return res.render("error", { message: "Access Denied: Only Drivers allowed", user: req.user });
    }
    next();
  });
};

// Admin-only route middleware
const adminAuthMiddleware = async (req, res, next) => {
  await authMiddleware(req, res, async () => {
    if (req.user.userType !== "Admin") {
      return res.render("error", { message: "Access Denied: Only Admin allowed", user: req.user });
    }
    next();
  });
};

// Examiner-only route middleware
// const examinerAuthMiddleware = async (req, res, next) => {
//   if (!req.session.userId) {
//     return res.redirect("/login");
//   }

//   try {
//     const user = await User.findById(req.session.userId);
//     if (!user) {
//       req.session.destroy();
//       return res.render("login", { error: "User not found", user: null });
//     }

//     if (user.userType !== "Examiner") {
//       return res.render("error", { message: "Access Denied: Only Examiners allowed", user });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("Auth middleware error:", err);
//     return res.render("login", { error: "Authentication error", user: null });
//   }
// };

const examinerAuthMiddleware = async (req, res, next) => {
  await authMiddleware(req, res, async () => {
    if (req.user.userType !== "Examiner") {
      return res.render("error", { message: "Access Denied: Only Examiners allowed", user: req.user });
    }
    next();
  });
};

// Redirect root to login
app.get("/", (req, res) => res.redirect("/login"));

// Login route
app.get("/login", (req, res) => {
  res.render("login", { 
    error: null, 
    user: null,
    session: {
      user: req.session.userId ? req.user : null
    }
  });
});

app.post("/login", loginController);

// signup route
app.get("/signup", (req, res) => res.render("signup", { error: null, user: null }));
app.post("/signup", signController);

// Home route
app.get("/home", authMiddleware, homeController);

// G2 route for drivers
app.get("/g2", driverAuthMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ userId: req.user._id });
    const availableAppointments = await Appointment.find({ isTimeSlotAvailable: true });

    res.render("g2", {
      user: req.user,
      appointment: appointment || null,
      availableAppointments,
      message: null,
      selectedDate: "",
      session: {
        user: req.user,
        appointment: appointment || null,
        selectedDate: ""
      }
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.render("g2", {
      user: req.user,
      appointment: null,
      availableAppointments: [],
      selectedDate: "",
      session: {
        user: req.user,
        appointment: null,
        selectedDate: ""
      }
    });
  }
});

// Cancel and submit appointments (G2)
app.post("/g2/cancel", driverAuthMiddleware, cancelbookingController);
app.post("/g2/submit", driverAuthMiddleware, newuserController);

//Admin (GET and POST in one route)
app.route("/appointment")
  .get(adminAuthMiddleware, appointmentController)
  .post(adminAuthMiddleware, appointmentController);

// Examiner  (GET and POST in one route)
app.route("/examiner")
  .get(examinerAuthMiddleware, examinerController)
  .post(examinerAuthMiddleware, examinerController);

// G license route for drivers
app.get("/g", driverAuthMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ userId: req.user._id });
    res.render("g", {
      user: req.user,
      appointment,
      message: null,
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.render("g", {
      user: req.user,
      appointment: null,
      message: "Error fetching appointment details.",
    });
  }
});

// Update G test
app.post("/g/update", driverAuthMiddleware, updateController);

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
