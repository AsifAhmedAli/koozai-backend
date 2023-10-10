const { check, validationResult } = require('express-validator');

// Validate the users registration request
const validateRegistration = [
  check('username').trim().notEmpty().withMessage('User Name is required'),
//   .custom(value => !/\s/.test(value)).withMessage('Username should not contain spaces'),
  check('phone').trim().notEmpty().withMessage('Phone is required'),
  check('password').trim().notEmpty().withMessage('Login Password is required'),
  check('withdraw_password').trim().notEmpty().withMessage('Withdraw Password is required'),
  check('gender').trim().notEmpty().withMessage('Gender is required'),
  check('invitation_code').trim().notEmpty().withMessage('Invitation code is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


// valdidate login 

const validateLogin = [
    check('identifier').trim().notEmpty().withMessage('User Name or Phone is required to Login'),
    check('password').trim().notEmpty().withMessage('Password is required'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];


//   const validateContactUs = [
//     check('topic').trim().notEmpty().withMessage('Topic is required'),
//     check('name').trim().notEmpty().withMessage('Name is required'),
//     check('phone').trim().notEmpty().withMessage('Phone Number is required'),
//     check('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
//     check('phone').trim().notEmpty().withMessage('Country is required'),
//     check('purpose').trim().notEmpty().withMessage('Purpose is required'),
//     check('message').trim().notEmpty().withMessage('Messsage is required'),
//     (req, res, next) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       next();
//     }
//   ];

module.exports = { validateRegistration,validateLogin };
