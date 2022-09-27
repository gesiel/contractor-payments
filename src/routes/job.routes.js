const express = require('express');
const { getProfile } = require('../middleware/getProfile');

const jobRoutes = ({ findAllUnpaidJobs, payJob }) => {
  const router = express.Router();
  router.use(getProfile);

  /**
   * @returns unpaid jobs for active contracts
   */
  router.get('/unpaid', async (req, res) => {
    const jobs = await findAllUnpaidJobs(req.profile.id);
    res.json({ jobs });
  });

  /**
   * Client pays a job for a contractor
   */
  router.post('/:jobId/pay', async (req, res) => {
    const { jobId } = req.params;
    try {
      await payJob(req.profile.id, jobId);
      res.status(204).end();
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  });

  return router;
};

module.exports = jobRoutes;
