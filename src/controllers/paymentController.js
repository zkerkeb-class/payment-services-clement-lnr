const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createStripeProduct = async (req, res) => {
  try {
    const { name, description, price, images = [] } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({
        error: 'name, description et price sont requis'
      });
    }

    // Filtrer les images vides ou invalides
    const validImages = images.filter(url => url && url.trim() !== '' && url.trim() !== 'undefined');
    console.log('📸 Images reçues:', images);
    console.log('✅ Images valides filtrées:', validImages);

    // Créer le produit Stripe
    const productData = {
      name: name,
      description: description,
      metadata: {
        source: 'shop-api'
      }
    };

    // N'ajouter les images que si on en a des valides
    if (validImages.length > 0) {
      productData.images = validImages;
    }

    const product = await stripe.products.create(productData);

    // Créer le prix associé au produit
    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(price * 100), // Convertir en centimes
      currency: 'eur',
      product: product.id,
    });

    res.json({
      success: true,
      stripeProductId: product.id,
      stripePriceId: stripePrice.id,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        default_price: stripePrice.id
      }
    });

  } catch (error) {
    console.error('Erreur lors de la création du produit Stripe:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du produit Stripe',
      details: error.message
    });
  }
};

exports.createCheckoutSession = async (req, res) => {
  try {
    const { 
      price_data, 
      quantity = 1, 
      success_url, 
      cancel_url,
      customer_email,
      metadata = {},
      items // Nouveau: pour les paniers
    } = req.body;

    let line_items = [];

    // Format panier (avec items)
    if (items && Array.isArray(items) && items.length > 0) {
      line_items = items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            metadata: {
              product_id: item.id.toString(),
              color: item.selectedColor || 'default'
            }
          },
          unit_amount: Math.round(item.price * 100), // Convertir en centimes
        },
        quantity: item.quantity || 1,
      }));
    }
    // Format ancien (avec price_data)
    else if (price_data) {
      line_items = [
        {
          price_data: {
            currency: price_data.currency || 'eur',
            product_data: {
              name: price_data.product_name,
              description: price_data.description,
              images: price_data.images || []
            },
            unit_amount: price_data.unit_amount,
          },
          quantity: quantity,
        },
      ];
    } else {
      return res.status(400).json({
        error: 'Vous devez fournir soit "items" (pour un panier) soit "price_data" (pour un produit unique)'
      });
    }

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: success_url || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cart`,
      metadata: {
        ...metadata,
        source: items ? 'cart-checkout' : 'single-product'
      }
    };

    if (customer_email) {
      sessionConfig.customer_email = customer_email;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({
      success: true,
      id: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Erreur lors de la création de la session Checkout:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création de la session de paiement',
      details: error.message 
    });
  }
};

exports.getCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    res.json({
      id: session.id,
      payment_status: session.payment_status,
      customer_details: session.customer_details,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération de la session',
      details: error.message 
    });
  }
};