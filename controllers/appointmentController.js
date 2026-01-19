const Appointment = require('../models/appointment');
const User = require('../models/User');

module.exports = async (req, res) => {
  try {
    let message = null;
    let users = [];
    let tabToShow = 'create-slots';

    // Initialize session filters if not present
    req.session.filters = req.session.filters || {};

    // Update session from query parameters
    if (req.query.testType !== undefined) {
      req.session.filters.testType = req.query.testType;
    }
    if (req.query.testResult !== undefined) {
      req.session.filters.testResult = req.query.testResult;
    }
    if (req.query.filterDate !== undefined) {
      req.session.filters.filterDate = req.query.filterDate;
    }
    if (req.query.availability !== undefined) {
      req.session.filters.availability = req.query.availability;
    }
    if (req.query.licenseReady !== undefined) {
      req.session.filters.licenseReady = req.query.licenseReady;
    }

    // Use session-stored filters
    let testType = req.session.filters.testType || '';
    let testResult = req.session.filters.testResult || '';
    let filterDate = req.session.filters.filterDate || '';
    let availability = req.session.filters.availability || '';
    let licenseReady = req.session.filters.licenseReady || '';

    // Handle POST request for creating appointments
    if (req.method === 'POST') {
      const { date, timeSlots } = req.body;
      const slots = timeSlots ? timeSlots.split(',') : [];

      if (slots.length === 0) {
        message = { type: 'warning', text: 'Please select at least one time slot.' };
      } else {
        const existingAppointments = await Appointment.find({ date, time: { $in: slots } });
        const existingTimes = existingAppointments.map(app => app.time);
        const newSlots = slots.filter(slot => !existingTimes.includes(slot));

        if (newSlots.length === 0) {
          message = { type: 'warning', text: 'All selected slots already exist.' };
        } else {
          const appointments = newSlots.map(time => ({
            date,
            time,
            createdBy: req.user._id,
            isTimeSlotAvailable: true
          }));

          await Appointment.insertMany(appointments);
          message = { type: 'success', text: `Created ${newSlots.length} slot(s) for ${date}!` };
          tabToShow = 'view-appointments';
        }
      }
    }

    // Fetch appointments with filtering
    let appointmentQuery = {};
    if (filterDate) appointmentQuery.date = filterDate;

    if (availability === 'available') {
      appointmentQuery.isTimeSlotAvailable = true;
    } else if (availability === 'booked') {
      appointmentQuery.isTimeSlotAvailable = false;
    }

    const existingAppointments = await Appointment.find(appointmentQuery).sort({ date: 1, time: 1 });

    // Get booked appointment user details
    const bookedAppointments = existingAppointments.filter(app => !app.isTimeSlotAvailable && app.userId);
    if (bookedAppointments.length > 0) {
      const userIds = bookedAppointments.map(app => app.userId);
      const appointmentUsers = await User.find({ _id: { $in: userIds } });

      for (const app of existingAppointments) {
        if (!app.isTimeSlotAvailable && app.userId) {
          const appointmentUser = appointmentUsers.find(u => u._id.toString() === app.userId.toString());
          if (appointmentUser) {
            app.userName = `${appointmentUser.firstname} ${appointmentUser.lastname}`;
          }
        }
      }
    }

    // Fetch driver users with filtering
    let userQuery = { userType: 'Driver' };

    if (testType) {
      userQuery.testType = testType;
      tabToShow = 'driver-details';
    }

    if (testResult) {
      if (testResult === 'Pending') {
        userQuery.$or = [
          { testResult: { $exists: false } },
          { testResult: null },
          { testResult: 'Pending' }
        ];
      } else {
        userQuery.testResult = testResult;
      }
      tabToShow = 'driver-details';
    }

    if (licenseReady) {
      userQuery.licenseReady = licenseReady;
      tabToShow = 'driver-details';
    }

    users = await User.find(userQuery);

    for (const driver of users) {
      const driverAppointment = await Appointment.findOne({ userId: driver._id });
      if (driverAppointment) {
        driver.appointmentDetails = {
          date: driverAppointment.date,
          time: driverAppointment.time
        };
      }
    }

    res.render('appointment', {
      user: req.user,
      message,
      existingAppointments,
      selectedDate: req.body.date || '',
      users,
      testType,
      testResult,
      filterDate,
      availability,
      licenseReady,
      tabToShow,
      session: {
        user: req.user
      }
    });

  } catch (error) {
    console.error('Error in appointment controller:', error);
    res.render('appointment', {
      user: req.user,
      message: { type: 'danger', text: 'Error processing request: ' + error.message },
      existingAppointments: [],
      selectedDate: req.body.date || '',
      users: [],
      testType: '',
      testResult: '',
      filterDate: '',
      availability: '',
      licenseReady: '',
      tabToShow: 'create-slots',
      session: {
        user: req.user
      }
    });
  }
};