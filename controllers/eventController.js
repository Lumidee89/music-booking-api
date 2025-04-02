const Event = require('../models/Event');
const Artist = require('../models/Artist');
const ErrorResponse = require('../utils/errorResponse');

exports.getEvents = async (req, res, next) => {
  try {
    let query;

    if (req.params.artistId) {
      query = Event.find({ artist: req.params.artistId });
    } else {
      query = Event.find().populate({
        path: 'artist',
        select: 'name genre',
      });
    }

    const events = await query;

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    next(err);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate({
      path: 'artist',
      select: 'name genre',
    });

    if (!event) {
      return next(
        new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    req.body.artist = req.params.artistId;

    const artist = await Artist.findById(req.params.artistId);

    if (!artist) {
      return next(
        new ErrorResponse(
          `Artist not found with id of ${req.params.artistId}`,
          404
        )
      );
    }

    if (artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to create an event for this artist`,
          401
        )
      );
    }

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return next(
        new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
      );
    }

    const artist = await Artist.findById(event.artist);
    if (artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this event`,
          401
        )
      );
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(
        new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
      );
    }

    const artist = await Artist.findById(event.artist);
    if (artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this event`,
          401
        )
      );
    }

    await event.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};