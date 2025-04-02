const Artist = require('../models/Artist');
const ErrorResponse = require('../utils/errorResponse');

exports.getArtists = async (req, res, next) => {
  try {
    const artists = await Artist.find().populate('user');

    res.status(200).json({
      success: true,
      count: artists.length,
      data: artists,
    });
  } catch (err) {
    next(err);
  }
};

exports.getArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id).populate('user');

    if (!artist) {
      return next(
        new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: artist,
    });
  } catch (err) {
    next(err);
  }
};

exports.createArtist = async (req, res, next) => {
  req.body.user = req.user.id;

  const existingArtist = await Artist.findOne({ user: req.user.id });

  if (existingArtist) {
    return next(
      new ErrorResponse(`User ${req.user.id} is already an artist`, 400)
    );
  }

  try {
    const artist = await Artist.create(req.body);

    res.status(201).json({
      success: true,
      data: artist,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateArtist = async (req, res, next) => {
  try {
    let artist = await Artist.findById(req.params.id);

    if (!artist) {
      return next(
        new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404)
      );
    }

    if (artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this artist`,
          401
        )
      );
    }

    artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: artist,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return next(
        new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404)
      );
    }

    if (artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this artist`,
          401
        )
      );
    }

    await artist.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};