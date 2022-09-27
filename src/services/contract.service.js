const { Op } = require('sequelize');
const { Contract } = require('../model');

const userFilter = (userId) => ({
  [Op.or]: [
    {
      ContractorId: userId,
    },
    {
      ClientId: userId,
    },
  ],
});

const contractService = {
  findInProgressContracts: (userId) =>
    Contract.findAll({
      where: {
        status: 'in_progress',
        ...userFilter(userId),
      },
    }),

  findUserContractById: (userId, contractId) =>
    Contract.findOne({
      where: {
        id: contractId,
        ...userFilter(userId),
      },
    }),
};

module.exports = contractService;
