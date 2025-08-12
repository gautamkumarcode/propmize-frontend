# E-State Platform 🏠

A modern, scalable real estate platform built with Next.js 15, featuring AI-powered property search, integrated payment systems, and comprehensive CRM functionality.

## 🌟 Features

### For Buyers
- 🤖 **AI Property Assistant** - GPT-4 powered chat for property recommendations
- 🔍 **Smart Search** - Advanced filtering with location, price, amenities
- ❤️ **Save Properties** - Bookmark favorite listings
- 👁️ **Recently Viewed** - Track your property browsing history
- 📞 **Contact Owners** - Direct communication with sellers
- 🏙️ **New Projects** - Stay updated with latest developments
- 📖 **Buyer's Guide** - Expert advice and market insights

### For Sellers
- 📊 **Dashboard Analytics** - Views, inquiries, and performance metrics
- 💼 **Lead Management** - Track and respond to buyer inquiries
- ➕ **Easy Listing** - Add properties with photo uploads
- 💎 **Premium Plans** - Boost visibility with premium listings
- 📱 **Mobile Optimized** - Fixed bottom navigation for quick actions
- 🔔 **Push Notifications** - Instant alerts for new inquiries

### Platform Features
- 🔐 **OTP Authentication** - Secure login with MSG91 integration
- 💳 **Payment Gateway** - Razorpay integration for premium plans
- 📄 **GST Invoicing** - Automated invoicing with Zoho Books
- 🎯 **CRM Integration** - Lead management with Zoho CRM
- ☁️ **Cloud Storage** - Google Cloud Storage for property images
- 🔔 **Push Notifications** - Firebase Cloud Messaging
- 📱 **PWA Ready** - Installable mobile experience

## 🛠️ Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **State Management:** Zustand with persistence
- **UI Components:** Radix UI, Lucide React icons
- **Authentication:** MSG91 OTP, NextAuth.js
- **Database:** Ready for PostgreSQL/MongoDB integration
- **Payments:** Razorpay Gateway
- **File Storage:** Google Cloud Storage
- **AI/ML:** OpenAI GPT-4 Turbo
- **CRM:** Zoho CRM & Books integration
- **Notifications:** Firebase Cloud Messaging

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- Access to third-party service accounts (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd e-state-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your service credentials in `.env.local` (see Configuration section)

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

### Required Services Setup

#### 1. Razorpay (Payment Gateway)
- Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com)
- Get your Key ID and Key Secret
- Configure webhook endpoints
- Update `.env.local` with credentials

#### 2. MSG91 (OTP Authentication)
- Register at [MSG91](https://msg91.com)
- Get your Auth Key
- Create SMS template for OTP
- Update configuration

#### 3. OpenAI (AI Chatbot)
- Get API key from [OpenAI Platform](https://platform.openai.com)
- Configure GPT-4 Turbo access
- Set up usage limits

#### 4. Firebase (Push Notifications)
- Create project at [Firebase Console](https://console.firebase.google.com)
- Enable Cloud Messaging
- Generate VAPID keys
- Download service account key

#### 5. Zoho CRM & Books (Customer Management)
- Create Zoho account and apps
- Generate OAuth credentials
- Configure webhooks
- Set up organization for Books

#### 6. Google Cloud Storage (File Uploads)
- Create GCP project
- Enable Cloud Storage API
- Create service account
- Generate JSON key file

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Core Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="your_database_connection"

# Service Integrations
RAZORPAY_KEY_ID="rzp_test_..."
MSG91_AUTH_KEY="your_auth_key"
OPENAI_API_KEY="sk-..."
# ... (see .env.example for complete list)
```

## 🏗️ Project Structure

```
e-state-platform/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Buyer home page
│   ├── seller/                   # Seller dashboard
│   └── api/                      # API routes
├── src/
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI components
│   │   ├── layout/              # Layout components
│   │   └── features/            # Feature-specific components
│   ├── lib/
│   │   ├── integrations/        # Third-party service integrations
│   │   ├── services/            # Business logic services
│   │   └── utils.ts            # Utility functions
│   ├── store/                   # Zustand state management
│   ├── types/                   # TypeScript type definitions
│   ├── hooks/                   # Custom React hooks
│   └── utils/                   # Helper utilities
├── public/                      # Static assets
└── docs/                       # Documentation
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Adding New Features

1. **Create components** in appropriate directories
2. **Add types** in `src/types/index.ts`
3. **Update store** if state management needed
4. **Add API routes** in `app/api/`
5. **Update documentation**

### Service Integration Pattern

Each service follows a modular pattern:

```typescript
// 1. Create service class
export class NewService {
  constructor(config: ServiceConfig) {
    // Initialize service
  }
  
  async methodName(): Promise<Result> {
    // Implementation
  }
}

// 2. Add to config
export const serviceConfig = {
  newService: {
    apiKey: process.env.NEW_SERVICE_API_KEY,
    enabled: true,
  }
};

// 3. Initialize in config.ts
services.newService = new NewService(config.newService);
```

## 🚀 Deployment

### Prerequisites for Deployment

1. **Domain & Hosting**
   - Purchase domain name
   - Set up hosting (Vercel, Netlify, or custom server)

2. **Database Setup**
   - PostgreSQL or MongoDB instance
   - Connection string configuration

3. **Service Accounts**
   - All production API keys
   - Webhook endpoint configurations
   - SSL certificates

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

2. **Environment Variables**
   - Add all production environment variables in Vercel dashboard
   - Update webhook URLs to production domain

3. **Domain Configuration**
   - Add custom domain in Vercel
   - Update CORS settings for all services

### Manual Server Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Reverse proxy setup** (Nginx example)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 📱 Mobile Features

- **Progressive Web App (PWA)** ready
- **Responsive design** for all screen sizes
- **Touch-optimized** navigation
- **Offline support** for basic features
- **Push notifications** for mobile browsers

## 🔒 Security Features

- **OTP-based authentication**
- **JWT token management**
- **Input validation and sanitization**
- **Rate limiting** on API endpoints
- **CORS configuration**
- **Environment variable protection**

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

## 📊 Monitoring & Analytics

- **Error tracking** with service integrations
- **Performance monitoring**
- **User analytics** (Google Analytics ready)
- **Business metrics** dashboard

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 API Documentation

### Authentication Endpoints
- `POST /api/auth/send-otp` - Send OTP to mobile number
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/refresh` - Refresh access token

### Property Endpoints
- `GET /api/properties` - Get properties with filters
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Payment Endpoints
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

[Full API documentation available in `docs/api.md`]

## 🐛 Troubleshooting

### Common Issues

1. **Dependencies not installing**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript errors**
   ```bash
   npm run type-check
   ```

3. **Service integration failures**
   - Check API keys in `.env.local`
   - Verify service status
   - Check network connectivity

### Getting Help

- 📧 **Email:** support@yourdomain.com
- 💬 **Discord:** [Community Server]
- 📚 **Documentation:** [Full Docs](./docs/)
- 🐛 **Issues:** [GitHub Issues](./issues)

## 📋 Todo / Roadmap

- [ ] Multi-language support
- [ ] Advanced property search filters
- [ ] Virtual property tours
- [ ] Loan calculator integration
- [ ] Property comparison feature
- [ ] Social sharing
- [ ] Reviews and ratings system
- [ ] Advanced analytics dashboard

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All the open-source contributors
- Third-party service providers

---

**Made with ❤️ for the real estate industry**

For questions or support, please contact [Aradhya Technologies](mailto:your-email@example.com)
