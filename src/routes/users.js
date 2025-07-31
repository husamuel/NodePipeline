const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const users = [];

router.get('/', (req, res) => {
  res.status(200).json({ users });
});

router.post(
  '/',
  body('name').notEmpty().withMessage('Name is required'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const newUser = { id: users.length + 1, name };
    users.push(newUser);
    res.status(201).json(newUser);
  }
);

module.exports = router;
