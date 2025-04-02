const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(getEvents).post(protect, createEvent);
router
  .route('/:id')
  .get(getEvent)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

module.exports = router;