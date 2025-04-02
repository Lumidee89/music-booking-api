const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide an artist name'],
    trim: true,
    maxlength: [50, 'Artist name cannot be more than 50 characters'],
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre'],
  },
  bio: {
    type: String,
    required: [true, 'Please provide a bio'],
    maxlength: [500, 'Bio cannot be more than 500 characters'],
  },
  website: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid website URL!`
    }
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String,
  },
  images: [String],
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must can not be more than 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

artistSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email role',
  });
  next();
});

module.exports = mongoose.model('Artist', artistSchema);