const { Op } = require("sequelize");
const { Job, sequelize, Contract, Profile } = require("../model");

const reportsService = {
  bestProfession: async (start, end) => {
    const bestOne = await Job.findOne({
      attributes: [
        [sequelize.fn("sum", sequelize.col("price")), "profit"],
        [sequelize.col("Contract.Contractor.profession"), "profession"],
      ],
      where: {
        paid: true,
        ...(start &&
          end && {
            paymentDate: {
              [Op.gte]: start,
              [Op.lte]: end,
            },
          }),
      },
      group: "Contract.Contractor.profession",
      order: [[sequelize.col("profit"), "DESC"]],
      include: [
        {
          model: Contract,
          required: true,
          include: [
            {
              model: Profile,
              as: "Contractor",
              attributes: ["profession"],
              required: true,
            },
          ],
        },
      ],
    });

    return (
      bestOne && {
        profession: bestOne.get("profession"),
        profit: bestOne.get("profit"),
      }
    );
  },
  bestClients: async (start, end, limit) => {
    const bestOnes = await Job.findAll({
      attributes: [
        [sequelize.fn("sum", sequelize.col("price")), "paid"],
      ],
      where: {
        paid: true,
        ...(start &&
          end && {
            paymentDate: {
              [Op.gte]: start,
              [Op.lte]: end,
            },
          }),
      },
      group: "Contract.Client.id",
      order: [[sequelize.col("paid"), "DESC"]],
      limit,
      include: [
        {
          model: Contract,
          required: true,
          include: [
            {
              model: Profile,
              as: "Client",
              required: true,
            },
          ],
        },
      ],
    });

    return bestOnes.map((c) => ({
      id: c.Contract.Client.id,
      fullName: [c.Contract.Client.firstName, c.Contract.Client.lastName].join(
        " "
      ),
      paid: c.get("paid"),
    }));
  },
};

module.exports = reportsService;
