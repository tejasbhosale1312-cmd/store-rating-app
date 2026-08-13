const { body } = require('express-validator');

const nameRule = body('name')
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters');

const emailRule = body('email').isEmail().withMessage('Must be a valid email');

const addressRule = body('address')
  .optional({ checkFalsy: true })
  .isLength({ max: 400 })
  .withMessage('Address must be at most 400 characters');

const passwordRule = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8-16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('Password must contain at least one special character');

const ratingRule = body('value')
  .isInt({ min: 1, max: 5 })
  .withMessage('Rating must be an integer between 1 and 5');

module.exports = { nameRule, emailRule, addressRule, passwordRule, ratingRule };