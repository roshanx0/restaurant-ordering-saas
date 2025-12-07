// Supabase Configuration
// Replace these with your actual Supabase project credentials
// Get them from: https://app.supabase.com/project/_/settings/api

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

// Application Configuration
export const APP_CONFIG = {
  appName: "FoodOrder",
  defaultCurrency: "₹",
  taxRate: 0.05, // 5% GST
  orderPrefix: "ORD",

  // Subscription plans
  plans: {
    free_trial: {
      name: "Free Trial",
      price: 0,
      duration: "14 days",
      features: [
        "Up to 50 orders/month",
        "Basic menu management",
        "QR ordering",
        "Email support",
      ],
    },
    starter: {
      name: "Starter",
      price: 299,
      duration: "per month",
      features: [
        "Unlimited orders",
        "Full menu management",
        "QR ordering",
        "Reports",
        "WhatsApp support",
      ],
    },
    pro: {
      name: "Pro",
      price: 599,
      duration: "per month",
      features: [
        "Everything in Starter",
        "Multiple locations",
        "Advanced analytics",
        "Custom branding",
        "Priority support",
      ],
    },
  },

  // Restaurant types
  restaurantTypes: [
    "Restaurant",
    "Food Truck",
    "Cafe",
    "Bakery",
    "Cloud Kitchen",
    "Fine Dining",
    "Quick Service",
    "Other",
  ],

  // Menu categories
  menuCategories: [
    "Starters",
    "Main Course",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Beverages",
    "Desserts",
    "Snacks",
    "Other",
  ],

  // Order statuses
  orderStatuses: {
    pending: { label: "Pending", color: "warning" },
    accepted: { label: "Accepted", color: "accent-secondary" },
    preparing: { label: "Preparing", color: "accent-secondary" },
    ready: { label: "Ready", color: "success" },
    completed: { label: "Completed", color: "success" },
    cancelled: { label: "Cancelled", color: "error" },
    rejected: { label: "Rejected", color: "error" },
  },

  // Payment methods
  paymentMethods: ["Cash", "UPI", "Card", "Other"],

  // Registration sources
  heardFromOptions: [
    "Google Search",
    "Social Media",
    "Friend/Referral",
    "Advertisement",
    "Other",
  ],
};
