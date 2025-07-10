const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handleWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Erreur de signature du webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      handleCheckoutSessionCompleted(event.data.object);
      break;
    
    case 'payment_intent.succeeded':
      handlePaymentIntentSucceeded(event.data.object);
      break;
    
    case 'payment_intent.payment_failed':
      handlePaymentIntentFailed(event.data.object);
      break;
      
    default:
      console.log(`Type d'événement non géré: ${event.type}`);
  }

  res.json({ received: true });
};

const handleCheckoutSessionCompleted = (session) => {
  console.log('🎉 Paiement réussi pour la session:', session.id);
  console.log('Détails:', {
    customer_email: session.customer_details?.email,
    amount_total: session.amount_total,
    currency: session.currency,
    payment_status: session.payment_status,
    metadata: session.metadata
  });
  
  // TODO: Ajouter votre logique métier ici
  // Par exemple:
  // - Mettre à jour la base de données
  // - Envoyer un email de confirmation
  // - Activer l'accès au produit/service
  // - Générer une facture
};

const handlePaymentIntentSucceeded = (paymentIntent) => {
  console.log('💳 PaymentIntent réussi:', paymentIntent.id);
  console.log('Montant:', paymentIntent.amount, paymentIntent.currency);
  
  // TODO: Logique pour paiement réussi
};

const handlePaymentIntentFailed = (paymentIntent) => {
  console.log('❌ Paiement échoué:', paymentIntent.id);
  console.log('Raison:', paymentIntent.last_payment_error?.message);
  
  // TODO: Logique pour paiement échoué
  // - Notifier l'utilisateur
  // - Retry automatique si nécessaire
};