# 🚀 Campus Wallet Backend Server - Fiserv Integration

This is the backend server for the Smart Campus Wallet app with Fiserv payment processing integration.

## 📋 Prerequisites

- Node.js 16+ installed
- Fiserv Developer Account and API credentials
- Basic understanding of Express.js

## 🛠️ Setup Instructions

### Step 1: Install Dependencies

```bash
cd backend-server
npm install
```

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Fiserv credentials:
```bash
# Get these from Fiserv Developer Portal
FISERV_API_KEY=your_api_key_here
FISERV_API_SECRET=your_api_secret_here
FISERV_MERCHANT_ID=your_merchant_id
FISERV_STORE_ID=your_store_id
FISERV_TERMINAL_ID=your_terminal_id

# Generate a strong random key for app authentication
APP_API_KEY=generate_strong_random_key
```

### Step 3: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:3000`

## 📡 API Endpoints

### Payment Endpoints

```
POST   /api/payments/charge           # Process a payment
POST   /api/payments/refund           # Refund a transaction
GET    /api/payments/transaction/:id  # Get transaction details
POST   /api/payments/validate         # Validate card details
```

### Card Management Endpoints

```
POST   /api/cards/tokenize            # Tokenize and save a card
GET    /api/cards/list                # Get user's saved cards
DELETE /api/cards/:id                 # Delete a saved card
POST   /api/cards/set-default         # Set default card
```

### Health Check

```
GET    /health                        # Server health check
```

## 🧪 Testing

### Using Test Cards (Sandbox)

```javascript
// Successful Payment
{
  cardNumber: "4005550000000019",
  expiryMonth: "12",
  expiryYear: "25",
  cvv: "123"
}

// Declined Payment
{
  cardNumber: "4000300011112220",
  expiryMonth: "12",
  expiryYear: "25",
  cvv: "123"
}
```

### Test with cURL

```bash
# Health check
curl http://localhost:3000/health

# Process payment
curl -X POST http://localhost:3000/api/payments/charge \
  -H "Content-Type: application/json" \
  -H "X-App-API-Key: your_app_api_key" \
  -d '{
    "amount": 10.00,
    "currency": "USD",
    "description": "Campus Cafe Purchase",
    "cardDetails": {
      "cardNumber": "4005550000000019",
      "expiryMonth": "12",
      "expiryYear": "25",
      "cvv": "123",
      "cardholderName": "John Doe"
    },
    "userId": "U001",
    "merchantName": "Campus Cafe",
    "category": "Food"
  }'
```

## 📁 Project Structure

```
backend-server/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables (DO NOT COMMIT)
├── .env.example           # Template for .env
├── config/
│   └── fiserv.config.js   # Fiserv configuration
├── services/
│   └── fiservService.js   # Fiserv API service
├── routes/
│   └── payments.js        # Payment routes
├── middleware/
│   ├── auth.js            # Authentication
│   └── validation.js      # Request validation
└── utils/
    ├── signature.js       # HMAC signature
    └── logger.js          # Logging utility
```

## 🔒 Security Notes

- **NEVER** commit `.env` file
- Keep API secrets on server only
- Use HTTPS in production
- Implement rate limiting
- Validate all inputs
- Log security events

## 🚢 Deployment

### Option 1: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create campus-wallet-api

# Set environment variables
heroku config:set FISERV_API_KEY=your_key
heroku config:set FISERV_API_SECRET=your_secret
# ... set all other vars

# Deploy
git push heroku main
```

### Option 2: AWS/DigitalOcean/etc.

1. Set up a server with Node.js
2. Clone repository
3. Set environment variables
4. Install dependencies
5. Start with PM2: `pm2 start server.js`

## 📊 Monitoring

Check logs:
```bash
# Development
npm run dev

# Production with PM2
pm2 logs
```

## 🆘 Troubleshooting

### "Cannot connect to Fiserv API"
- Check your API credentials in `.env`
- Verify you're using sandbox URL for testing
- Check network connectivity

### "Authentication failed"
- Verify `APP_API_KEY` matches between app and server
- Check headers are being sent correctly

### "Invalid signature"
- Verify `FISERV_API_SECRET` is correct
- Check timestamp synchronization

## 📚 Resources

- [Fiserv API Documentation](https://developer.fiserv.com)
- [Express.js Guide](https://expressjs.com)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**For detailed implementation guide, see `FISERV_INTEGRATION_GUIDE.md` in the root directory.**

