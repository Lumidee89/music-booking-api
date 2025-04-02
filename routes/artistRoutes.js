const express = require('express');
const {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
} = require('../controllers/artistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getArtists).post(protect, createArtist);
router
  .route('/:id')
  .get(getArtist)
  .put(protect, updateArtist)
  .delete(protect, deleteArtist);

module.exports = router;