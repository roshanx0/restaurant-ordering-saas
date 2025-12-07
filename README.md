# FoodOrder - Multi-Tenant Restaurant Ordering SaaS Platform

A complete, production-ready restaurant ordering platform with QR code ordering, real-time updates, and multi-tenant support.

## 🎯 Features

- **Multi-tenant Architecture**: Separate dashboards for each restaurant
- **QR Code Ordering**: Customers scan QR to view menu and place orders
- **Real-time Updates**: Live order notifications and menu availability
- **Admin Panel**: Manage registrations, verify restaurants, track analytics
- **Restaurant Dashboard**: Manage orders, menu, bills, and reports
- **Modern UI**: Clean, white background design (Airbnb/Stripe style)
- **Mobile Responsive**: Works perfectly on all devices

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (built, not CDN)
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **QR Generation**: qrcode.react
- **PDF Export**: jsPDF + html2canvas

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)

## 🚀 Getting Started

### 1. Clone and Install

```bash
cd food-booking
npm install
```

### 2. Setup Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to **SQL Editor** and run this schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Registration requests table
CREATE TABLE registration_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  address TEXT,
  restaurant_type TEXT NOT NULL,
  heard_from TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  contacted_at TIMESTAMP,
  rejection_reason TEXT,
  internal_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Restaurants table
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_request_id UUID REFERENCES registration_requests(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_name TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT,
  address TEXT,
  logo_url TEXT,
  qr_code_url TEXT,
  subscription_plan TEXT DEFAULT 'free_trial',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  temp_password BOOLEAN DEFAULT true,
  role TEXT DEFAULT 'owner',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Menu items table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  category TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  sizes JSONB,
  addons JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  order_number TEXT,
  order_type TEXT DEFAULT 'qr',
  table_number TEXT,
  customer_phone TEXT,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2),
  tax DECIMAL(10,2),
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_transaction_id TEXT,
  customer_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_registration_requests_status ON registration_requests(status);

-- Enable Row Level Security (RLS)
ALTER TABLE registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow all for now - customize based on your security needs)
CREATE POLICY "Allow public read on registration_requests" ON registration_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert on registration_requests" ON registration_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on restaurants" ON restaurants FOR SELECT USING (true);

CREATE POLICY "Allow public read on menu_items" ON menu_items FOR SELECT USING (true);

CREATE POLICY "Allow public insert on orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on orders" ON orders FOR SELECT USING (true);

-- Create a default admin user (password: admin123)
-- Password hash for 'admin123' using SHA-256
INSERT INTO admin_users (email, password_hash, name)
VALUES ('admin@foodorder.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Super Admin');
```

4. Go to **Settings > API** and copy:

   - Project URL
   - anon/public key

5. Create `.env` file in project root:

```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:5173

## 🔑 Default Login Credentials

### Admin Panel

- URL: http://localhost:5173/admin/login
- Email: admin@foodorder.com
- Password: admin123

### Demo Restaurant

- URL: http://localhost:5173/login
- Email: demorestaurant@gmail.com
- Password: ATVSW679
- Customer Menu: http://localhost:5173/demo-restaurant

## 📱 Application Structure

```
/                       → Landing page
/register               → Restaurant registration
/login                  → Restaurant owner login
/dashboard              → Restaurant dashboard
  /dashboard/orders     → Orders management
  /dashboard/menu       → Menu management
  /dashboard/qr-code    → QR code download
  /dashboard/bills      → Bills & invoices
  /dashboard/reports    → Analytics
  /dashboard/settings   → Restaurant settings

/admin/login            → Admin login
/admin                  → Admin dashboard
  /admin/requests       → Pending registrations
  /admin/restaurants    → All restaurants
  /admin/analytics      → Platform analytics

/:restaurant-slug       → Customer ordering page
```

## 🎨 Design System

### Colors

- Background: `#FFFFFF`
- Subtle BG: `#FAFAFA`
- Text: `#0A0A0A`
- Text Secondary: `#6B6B6B`
- Accent: `#000000` / `#6366F1`
- Border: `#E5E5E5`
- Success: `#10B981`
- Error: `#EF4444`

### Typography

- Font: Inter (Google Fonts)
- Sizes: 12px, 14px, 15px, 18px, 24px, 32px
- Weights: 400, 500, 600, 700

## 🏗 Build for Production

```bash
npm run build
```

The `dist` folder will contain optimized production files.

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables


## 🤝 Contributing

This is a production-ready template. Feel free to customize based on your needs.

## 📄 License

MIT License - feel free to use this for commercial projects.

---
