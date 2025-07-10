const express = require('express');
const router = express.Router();
const paymentRoutes = require('./payment');
const webhookRoutes = require('./webhook');

router.use('/', paymentRoutes);
router.use('/webhook', webhookRoutes);

module.exports = router;