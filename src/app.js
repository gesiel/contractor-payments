const express = require('express');
const bodyParser = require('body-parser');
const contractRoutes = require('./routes/contract.routes');
const jobRoutes = require('./routes/job.routes');
const balanceRoutes = require('./routes/balance.routes');
const adminRoutes = require('./routes/admin.routes');
const contractService = require('./services/contract.service');
const jobService = require('./services/job.service');
const balanceService = require('./services/balance.service');
const reportsService = require('./services/reports.service');

const app = express();
app.use(bodyParser.json());

/**
 * contracts routes
 */
app.use('/contracts', contractRoutes(contractService));

/**
 * jobs routes
 */
app.use('/jobs', jobRoutes(jobService));

/**
 * balances routes
 */
app.use('/balances', balanceRoutes(balanceService));

/**
 * admin routes
 */
app.use('/admin', adminRoutes(reportsService));

module.exports = app;
