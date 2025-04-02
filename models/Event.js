const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true,
    maxlength: [100, 'Event title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide an event description'],
  },
  artist: {
    type: mongoose.Schema.ObjectId,
    ref: 'Artist',
    required: true,
  },
  venue: {
    type: String,
    required: [true, 'Please provide a venue'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide an event date'],
  },
  startTime: {
    type: String,
    required: [true, 'Please provide a start time'],
  },
  endTime: {
    type: String,
    required: [true, 'Please provide an end time'],
  },
  ticketPrice: {
    type: Number,
    required: [true, 'Please provide a ticket price'],
    min: [0, 'Ticket price cannot be negative'],
  },
  availableTickets: {
    type: Number,
    required: [true, 'Please provide available tickets count'],
    min: [0, 'Available tickets cannot be negative'],
  },
  images: [String],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

eventSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'artist',
    select: 'name genre',
  });
  next();
});

module.exports = mongoose.model('Event', eventSchema);