# Payment API - Stripe & AWS Lambda

Une API de paiement complète utilisant Express.js, Stripe Checkout et AWS Lambda.

## 🚀 Fonctionnalités

- ✅ Paiements ponctuels avec Stripe Checkout
- ✅ Gestion des abonnements
- ✅ Webhooks Stripe sécurisés
- ✅ Compatible AWS Lambda
- ✅ Développement local avec Express
- ✅ Configuration CORS et sécurité

## 📋 Prérequis

- Node.js 18+
- Compte Stripe (clés API)
- AWS CLI configuré (pour le déploiement)
- Serverless Framework (optionnel)

## 🔧 Installation

1. **Installer les dépendances :**
```bash
npm install
```

2. **Configurer les variables d'environnement :**
```bash
cp .env.example .env
```
Remplissez le fichier `.env` avec vos clés Stripe.

3. **Installer Serverless Framework (optionnel) :**
```bash
npm install -g serverless
npm install serverless-offline --save-dev
```

## 🏃‍♂️ Développement local

```bash
# Avec nodemon
npm run dev

# Ou avec Serverless Offline
serverless offline
```

L'API sera disponible sur `http://localhost:3000`

## 📡 Endpoints disponibles

### GET /
- **Description :** Informations de base de l'API
- **Réponse :** Status et version

### POST /create-checkout-session
- **Description :** Créer une session de paiement Stripe Checkout
- **Body :**
```json
{
  "price_data": {
    "product_name": "Mon Produit",
    "description": "Description du produit",
    "unit_amount": 2000,
    "currency": "eur",
    "images": ["https://exemple.com/image.jpg"]
  },
  "quantity": 1,
  "success_url": "https://votre-site.com/success?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://votre-site.com/cancel",
  "customer_email": "client@exemple.com",
  "metadata": {
    "order_id": "12345"
  }
}
```
### GET /checkout-session/:sessionId
- **Description :** Récupérer les détails d'une session Checkout
- **Paramètres :** `sessionId` - ID de la session Stripe


### POST /webhook
- **Description :** Webhook pour recevoir les événements Stripe
- **Headers :** `stripe-signature` requis

## 🚀 Déploiement sur AWS Lambda

1. **Configurer AWS CLI :**
```bash
aws configure
```

2. **Déployer avec Serverless :**
```bash
# Déploiement en développement
serverless deploy

# Déploiement en production
serverless deploy --stage prod
```

3. **Variables d'environnement AWS :**
Configurez vos variables d'environnement dans la console AWS Lambda ou via le fichier `serverless.yml`.

## 🔒 Sécurité

- Helmet.js pour les headers de sécurité
- CORS configuré
- Validation des signatures de webhook Stripe
- Variables d'environnement pour les clés sensibles

## 🧪 Test de l'API

### Exemple avec curl :

```bash
# Créer une session de paiement
curl -X POST http://localhost:3000/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "price_data": {
      "product_name": "Test Product",
      "unit_amount": 2000,
      "currency": "eur"
    },
    "success_url": "https://exemple.com/success",
    "cancel_url": "https://exemple.com/cancel"
  }'
```

## 📁 Structure du projet

```
payment-api/
├── src/
│   ├── app.js                        # Application Express principale (allégée)
│   ├── lambda.js                     # Wrapper AWS Lambda
│   ├── controllers/
│   │   ├── paymentController.js      # Logique des paiements Stripe
│   │   └── webhookController.js      # Logique des webhooks Stripe
│   └── routes/
│       ├── payment.js               # Routes des paiements
│       └── webhook.js               # Routes des webhooks
├── package.json                     # Dépendances et scripts
├── serverless.yml                   # Configuration Serverless
├── .env.example                     # Exemple de variables d'environnement
└── README.md                       # Documentation
```

## 🔧 Configuration Stripe

1. Créez un compte sur [Stripe Dashboard](https://dashboard.stripe.com)
2. Récupérez vos clés API (test et production)
3. Configurez un webhook endpoint pour recevoir les événements
4. Ajoutez l'URL de votre webhook dans Stripe Dashboard

## 🎯 Prochaines étapes

- [ ] Tests unitaires
- [ ] Authentification utilisateur
- [ ] Base de données pour persister les données
- [ ] Logs structurés
- [ ] Monitoring et alertes

## 📝 Licence

ISC 