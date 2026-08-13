const express = require('express');
const router = express.Router();
const { listStoresForUser, submitRating } = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');
const { ratingRule } = require('../utils/validators');

router.use(authenticate, authorize('user'));

router.get('/', listStoresForUser);
router.post('/:storeId/rating', [ratingRule], submitRating);

module.exports = router;