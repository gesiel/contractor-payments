const express = require('express');
const { body, validationResult } = require('express-validator');
const { getProfile } = require('../middleware/getProfile');

const balanceRoutes = ({ deposit }) => {
  const router = express.Router();
  router.use(getProfile);

  /**
   * Proccess a deposit operation in the client profile
   */
  router.post(
    '/deposit',
    body('amount').isNumeric().withMessage('Value must be Numeric'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const { amount } = req.body;
      try {
        await deposit(req.profile.id, amount);
        res.status(204).end();
      } catch (err) {
        res.status(400).send({ message: err.message });
      }
    },
  );

  return router;
};

module.exports = balanceRoutes;
