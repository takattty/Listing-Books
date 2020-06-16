'use strict';
const { check } = require('express-validator');

const validationCheck = [
  check('pass').not().isEmpty().withMessage('Input password!!'),
  check('pass').isLength({ max:20 }).withMessage('Too long! within 20 characters'),
  check('pass').matches(/[a-z]+/).withMessage('Input a-z'),
  check('pass').matches(/[A-Z]+/).withMessage('Input A-Z'),
  check('pass').matches(/\d+/).withMessage('Input num'),//正規表現
  check('pass').matches(/[!#$%&\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]+/).withMessage('Input symbol')
];

module.exports = validationCheck;