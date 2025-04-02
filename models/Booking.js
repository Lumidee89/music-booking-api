const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: [true, 'Booking must belong to an event'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user'],
  },
  artist: {
    type: mongoose.Schema.ObjectId,
    ref: 'Artist',
    required: [true, 'Booking must belong to an artist'],
  },
  tickets: {
    type: Number,
    required: [true, 'Please provide number of tickets'],
    min: [1, 'You must book at least 1 ticket'],
  },
  totalPrice: {
    type: Number,
    required: [true, 'Booking must have a total price'],
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer'],
    required: [true, 'Please provide a payment method'],
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'event',
    select: 'title date venue',
  }).populate({
    path: 'user',
    select: 'name email',
  }).populate({
    path: 'artist',
    select: 'name',
  });
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);