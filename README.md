# TerpalStore - Premium Tarpaulin Online Store

A modern, full-featured e-commerce web application built with Next.js 15+ and Supabase, specifically designed for selling premium tarpaulin products. This application provides a comprehensive online shopping experience with specialized features for tarpaulin customers.

## 🌟 Features

### Core E-commerce Functionality
- **Product Catalog**: Browse comprehensive tarpaulin inventory with detailed specifications
- **Advanced Search & Filtering**: Filter by material (PE, PVC, Canvas), usage, brand, price range
- **Product Detail Pages**: High-quality images, specifications, and technical details
- **Shopping Cart**: Add to cart, quantity management, save for later functionality
- **User Authentication**: Secure login, registration, and password reset via Supabase Auth

### Tarpaulin-Specific Features
- **Size Calculator**: Intelligent tool to calculate optimal tarpaulin size based on dimensions and usage
- **Material Guidance**: Expert recommendations for PE, PVC, and Canvas materials
- **Usage Categories**: Industrial, construction, household, agriculture, marine applications
- **Bulk Pricing**: Special pricing for large quantity orders
- **Custom Quote Requests**: Professional quote system for custom orders

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI Components**: Built with shadcn/ui component library
- **Type Safety**: Full TypeScript implementation
- **Real-time Updates**: Live stock management and pricing
- **SEO Optimized**: Next.js 15+ with server-side rendering
- **Performance**: Turbopack for fast development builds

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tarpaulin-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **For Development/Demo**: The app includes placeholder values that allow you to run it without a Supabase setup.

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:8000](http://localhost:8000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15+ App Router
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Sign in page
│   │   ├── register/      # Sign up page
│   │   └── reset/         # Password reset
│   ├── products/          # Product pages
│   │   ├── [id]/          # Product detail page
│   │   └── page.tsx       # Product listing
│   ├── cart/              # Shopping cart
│   ├── calculator/        # Size calculator tool
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── Navigation.tsx    # Main navigation
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
│   ├── supabase.ts       # Supabase client & types
│   └── utils.ts          # Utility functions
└── types/                # TypeScript type definitions
```

## 🛍️ Product Categories

### Materials Available
- **PE (Polyethylene)**: Lightweight, waterproof, UV-resistant
- **PVC**: Heavy-duty, tear-resistant, long-lasting
- **Canvas**: Breathable, natural fiber, fire-retardant options

### Usage Categories
- **Industrial**: Heavy machinery covers, warehouse protection
- **Construction**: Site protection, scaffold covers, debris containment
- **Household**: Garden covers, pool covers, outdoor furniture protection
- **Agriculture**: Crop protection, greenhouse covers, livestock shelters
- **Marine**: Boat covers, dock protection, marine equipment covers

## 🔧 Configuration

### Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

2. **Database Schema** (Optional - app works with mock data)
   ```sql
   -- Users table (handled by Supabase Auth)
   -- Products table
   CREATE TABLE products (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     price DECIMAL(10,2) NOT NULL,
     category TEXT,
     material TEXT CHECK (material IN ('PE', 'PVC', 'Canvas')),
     sizes TEXT[],
     thickness TEXT,
     colors TEXT[],
     brand TEXT,
     usage TEXT CHECK (usage IN ('industrial', 'household', 'construction')),
     stock_quantity INTEGER DEFAULT 0,
     images TEXT[],
     specifications JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 🎨 Customization

### Styling
- Built with **Tailwind CSS** for easy customization
- **shadcn/ui** components for consistent design system
- **Google Fonts** integration for typography
- **Dark/Light mode** support ready

### Adding New Features
1. **New Product Categories**: Update the `material` and `usage` enums
2. **Custom Pricing**: Modify the pricing logic in product components
3. **Additional Filters**: Extend the search/filter functionality
4. **Payment Integration**: Add Stripe or other payment processors

## 🧪 Testing

### Manual Testing Checklist
- [ ] Homepage loads with featured products
- [ ] Product listing with filters works
- [ ] Product detail pages display correctly
- [ ] Shopping cart add/remove functionality
- [ ] Size calculator provides accurate results
- [ ] Authentication flow (login/register/reset)
- [ ] Responsive design on mobile devices

### API Testing
```bash
# Test product endpoints (when using real Supabase)
curl -X GET "http://localhost:8000/api/products" \
  -H "Content-Type: application/json"

# Test authentication
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Full Next.js support
- **Railway**: Easy deployment with database
- **DigitalOcean App Platform**: Scalable hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the component examples in `/src/components`

## 🔮 Roadmap

### Upcoming Features
- [ ] Product comparison tool
- [ ] Quote request system
- [ ] Admin dashboard
- [ ] Order management
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

### Technical Improvements
- [ ] Unit and integration tests
- [ ] Performance optimization
- [ ] SEO enhancements
- [ ] Accessibility improvements
- [ ] PWA capabilities

---

**Built with ❤️ for the tarpaulin industry**

*TerpalStore - Your trusted source for premium tarpaulin solutions*
