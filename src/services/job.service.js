const { Op } = require('sequelize');
const { Job, Contract, Profile, sequelize } = require('../model');

const jobService = {
  findAllUnpaidJobs: (userId) =>
    Job.findAll({
      include: {
        model: Contract,
        where: {
          status: 'in_progress',
          [Op.or]: [
            {
              ContractorId: userId,
            },
            {
              ClientId: userId,
            },
          ],
        },
      },
      where: {
        [Op.or]: [{ paid: false }, { paid: null }],
      },
    }),

  payJob: async (userId, jobId) =>
    sequelize.transaction(async (transaction) => {
      const job = await Job.findOne({
        include: {
          model: Contract,
          where: {
            status: 'in_progress',
            ClientId: userId,
          },
        },
        where: {
          id: jobId,
          [Op.or]: [{ paid: false }, { paid: null }],
        },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });
      if (!job) {
        throw new Error('No unpaid job found');
      }

      const client = await Profile.findOne({
        where: {
          id: jobId,
        },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });
      if (!client) {
        throw new Error("Client's profile not found");
      }
      if (client.balance < job.price) {
        throw new Error('Insufficient funds');
      }

      const contractor = await Profile.findOne({
        where: {
          id: job.Contract.ContractorId,
        },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });
      if (!contractor) {
        throw new Error("Contractor's profile not found");
      }

      client.balance -= job.price;
      await client.save({ transaction });

      contractor.balance += job.price;
      await contractor.save({ transaction });

      job.paid = true;
      job.paymentDate = new Date();
      await job.save({ transaction });
    }),
};

module.exports = jobService;
