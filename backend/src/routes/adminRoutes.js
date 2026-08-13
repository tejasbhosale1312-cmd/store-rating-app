const express = require('express');
const router = express.Router();
const {
  getDashboard, createUser, createStore, listStores, listUsers, getUserDetail,
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { nameRule, emailRule, addressRule, passwordRule } = require('../utils/validators');

router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboard);
router.post('/users', [nameRule, emailRule, addressRule, passwordRule], createUser);
router.get('/users', listUsers);
router.get('/users/:id', getUserDetail);
router.post('/stores', [nameRule, emailRule, addressRule], createStore);
router.get('/stores', listStores);

module.exports = router;