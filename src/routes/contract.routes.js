const express = require('express');
const { getProfile } = require('../middleware/getProfile');

const contractRoutes = ({ findInProgressContracts, findUserContractById }) => {
  const router = express.Router();
  router.use(getProfile);

  /**
   * @returns contract by id
   */
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const contract = await findUserContractById(req.profile.id, id);
    if (!contract) return res.status(404).end();
    res.json(contract);
  });

  /**
   * @returns non terminated contracts
   */
  router.get('/', async (req, res) => {
    const contracts = await findInProgressContracts(req.profile.id);
    res.json({ contracts });
  });

  return router;
};

module.exports = contractRoutes;
