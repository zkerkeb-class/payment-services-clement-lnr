const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');

router.post('/create-stripe-product', paymentController.createStripeProduct);
router.post('/create-checkout-session', paymentController.createCheckoutSession);
router.get('/checkout-session/:sessionId', paymentController.getCheckoutSession);

module.exports = router;