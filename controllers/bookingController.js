const Booking = require('../models/Booking');
const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');

exports.getBookings = async (req, res, next) => {
  try {
    let query;

    if (req.params.userId) {
      query = Booking.find({ user: req.params.userId });
    } else {
      if (req.user.role !== 'admin') {
        return next(
          new ErrorResponse(
            `User ${req.user.id} is not authorized to view all bookings`,
            401
          )
        );
      }
      query = Booking.find();
    }

    const bookings = await query.populate({
      path: 'event',
      select: 'title date venue',
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: 'event',
      select: 'title date venue',
    });

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
      );
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to view this booking`,
          401
        )
      );
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    req.body.event = req.params.eventId;
    req.body.user = req.user.id;

    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return next(
        new ErrorResponse(`Event not found with id of ${req.params.eventId}`, 404)
      );
    }

    if (req.body.tickets > event.availableTickets) {
      return next(
        new ErrorResponse(
          `Not enough tickets available. Only ${event.availableTickets} tickets left`,
          400
        )
      );
    }

    req.body.totalPrice = event.ticketPrice * req.body.tickets;
    req.body.artist = event.artist;

    const booking = await Booking.create(req.body);

    event.availableTickets -= req.body.tickets;
    await event.save();

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
      );
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this booking`,
          401
        )
      );
    }

    const { paymentStatus } = req.body;
    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
      );
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this booking`,
          401
        )
      );
    }

    const event = await Event.findById(booking.event);
    event.availableTickets += booking.tickets;
    await event.save();

    await booking.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};