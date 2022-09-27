const express = require('express');
const { query, validationResult } = require('express-validator');
const { getProfile } = require('../middleware/getProfile');

const adminRoutes = ({ bestProfession, bestClients }) => {
  const router = express.Router();
  router.use(getProfile);

  /**
   * @returns Most profitable profession for period
   */
  router.get(
    '/best-profession',
    query('start').optional().isDate().withMessage('Value must be a Date'),
    query('end').optional().isDate().withMessage('Value must be a Date'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { start, end } = req.query;
      const result = await bestProfession(start, end);
      if (!result) {
        return res.status(404).end();
      }
      res.json(result);
    },
  );

  /**
   * @returns List of clients with the greatest payments for period
   */
  router.get(
    '/best-clients',
    query('start').optional().isDate().withMessage('Value must be a Date'),
    query('end').optional().isDate().withMessage('Value must be a Date'),
    query('limit').optional().isInt().withMessage('Value must be a Integer'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { start, end, limit = 2 } = req.query;
      const result = await bestClients(start, end, limit);
      res.json(result);
    },
  );

  return router;
};

module.exports = adminRoutes;
