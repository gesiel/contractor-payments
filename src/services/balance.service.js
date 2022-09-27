const { Op } = require("sequelize");
const { sequelize, Profile, Job, Contract } = require("../model");

const balanceService = {
  deposit: async (userId, amount) =>
    sequelize.transaction(async (transaction) => {
      const totalUnpaidAmount =
        (await Job.sum("price", {
          include: {
            model: Contract,
            where: {
              status: "in_progress",
              ClientId: userId,
            },
          },
          where: {
            [Op.or]: [{ paid: false }, { paid: null }],
          },
        })) || 1;
        
      if (amount / totalUnpaidAmount > 1.25) {
        throw new Error("Amount is higher then 25% of total jobs to pay");
      }

      const client = await Profile.findOne({
        where: {
          id: userId,
          type: "client",
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!client) {
        throw new Error("Client's profile not found");
      }

      client.balance += amount;
      await client.save({ transaction });
    }),
};

module.exports = balanceService;
