'use strict';
const { check } = require('express-validator');

const validationCheck = [
  check('text').not().isEmpty().withMessage('Write text message!'),
  check('text').isLength({ max:200 }).withMessage('Too long! within 200 characters')
];

module.exports = validationCheck;