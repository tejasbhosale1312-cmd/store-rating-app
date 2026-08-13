const express = require('express');
const router = express.Router();
const { signup, login, updatePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { nameRule, emailRule, addressRule, passwordRule } = require('../utils/validators');
const { body } = require('express-validator');

router.post('/signup', [nameRule, emailRule, addressRule, passwordRule], signup);
router.post('/login', [body('email').isEmail(), body('password').notEmpty()], login);
router.put(
  '/update-password',
  authenticate,
  [
    body('currentPassword').notEmpty(),
    body('newPassword')
      .isLength({ min: 8, max: 16 })
      .matches(/[A-Z]/)
      .matches(/[!@#$%^&*(),.?":{}|<>]/),
  ],
  updatePassword
);

module.exports = router;