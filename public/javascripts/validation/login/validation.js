'use strict';
const { check } = require('express-validator');

const validationCheck = [
  check('name').not().isEmpty().withMessage('Input your name!'),
  check('name').isLength({ max:20 }).withMessage('Too long! within 20 characters'),
  check('name').trim(),
  check('password1').not().isEmpty().withMessage('Input password!'),
  check('password2').not().isEmpty().withMessage('Input password!'),
  check('password1').isLength({ max:20 }).withMessage('Too long! within 20 characters'),
  check('password2').isLength({ max:20 }).withMessage('Too long! within 20 characters'),
  check('password1').matches(/[a-z]+/).withMessage('Input a-z'),
  check('password2').matches(/[a-z]+/).withMessage('Input a-z'),
  check('password1').matches(/[A-Z]+/).withMessage('Input A-Z'),
  check('password2').matches(/[A-Z]+/).withMessage('Input A-Z'),
  check('password1').matches(/\d+/).withMessage('Input num'),//正規表現
  check('password2').matches(/\d+/).withMessage('Input num'),//正規表現
  check('password1').matches(/[!#$%&\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]+/).withMessage('Input symbol'),
  check('password2').matches(/[!#$%&\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]+/).withMessage('Input symbol')
];

module.exports = validationCheck;