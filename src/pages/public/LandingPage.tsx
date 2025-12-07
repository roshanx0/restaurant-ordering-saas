import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  QrCode,
  Smartphone,
  TrendingUp,
  Clock,
  Check,
  Store,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { Button } from "../../components/ui";
import { APP_CONFIG } from "../../config/config";

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-white/95 backdrop-blur-sm z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Store className="w-8 h-8 text-accent" />
              <span className="text-xl font-bold text-text">
                {APP_CONFIG.appName}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-text-secondary hover:text-text transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-text-secondary hover:text-text transition-colors"
              >
                Pricing
              </a>
              <a
                href="#how-it-works"
                className="text-text-secondary hover:text-text transition-colors"
              >
                How it Works
              </a>
              <Link
                to="/login"
                className="text-text-secondary hover:text-text transition-colors"
              >
                Login
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-text"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-border">
              <a
                href="#features"
                className="block py-2 text-text-secondary hover:text-text transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block py-2 text-text-secondary hover:text-text transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#how-it-works"
                className="block py-2 text-text-secondary hover:text-text transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Works
              </a>
              <Link
                to="/login"
                className="block py-2 text-text-secondary hover:text-text transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button fullWidth>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 overflow-hidden">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              Digitize Your Restaurant
              <br />
              in Minutes
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
              Get your own QR ordering system. Let customers order directly from
              their phones. No app downloads, no commission fees, just seamless
              ordering.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Start Free Trial
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline">
                  See How it Works
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-text mb-1">50+</div>
                <div className="text-sm text-text-secondary">
                  Active Restaurants
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-text mb-1">10k+</div>
                <div className="text-sm text-text-secondary">
                  Orders Processed
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-text mb-1">4.9</div>
                <div className="text-sm text-text-secondary">
                  Customer Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-bg-subtle">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Everything you need to go digital
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              A complete ordering system designed specifically for restaurants,
              cafes, and food trucks
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: QrCode,
                title: "QR Code Ordering",
                description:
                  "Customers scan your unique QR code to view menu and place orders instantly",
              },
              {
                icon: Smartphone,
                title: "Mobile-First Design",
                description:
                  "Beautiful, fast interface that works perfectly on all devices",
              },
              {
                icon: TrendingUp,
                title: "Real-Time Updates",
                description:
                  "Get instant notifications for new orders. Update menu availability live",
              },
              {
                icon: Clock,
                title: "Save Time",
                description:
                  "No more taking orders manually. Focus on cooking and serving",
              },
            ].map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/5 mb-4">
                  <feature.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-text-secondary">
              Start with a 14-day free trial. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Object.entries(APP_CONFIG.plans).map(([key, plan]) => (
              <div
                key={key}
                className={`card ${
                  key === "starter" ? "ring-2 ring-accent relative" : ""
                }`}
              >
                {key === "starter" && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-text mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-text">
                      {APP_CONFIG.defaultCurrency}
                      {plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-text-secondary">
                        /{plan.duration}
                      </span>
                    )}
                  </div>
                  {plan.price === 0 && (
                    <span className="text-sm text-text-secondary">
                      {plan.duration}
                    </span>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button
                    variant={key === "starter" ? "primary" : "outline"}
                    fullWidth
                  >
                    {plan.price === 0 ? "Start Free Trial" : "Get Started"}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-bg-subtle">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Get started in 3 simple steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Register Your Restaurant",
                description:
                  "Fill out a quick form with your restaurant details. Our team will verify and contact you within 24 hours.",
              },
              {
                step: "02",
                title: "Setup Your Menu",
                description:
                  "Add your dishes, prices, photos, and categories through our easy-to-use dashboard.",
              },
              {
                step: "03",
                title: "Start Taking Orders",
                description:
                  "Display your QR code at tables. Customers scan, order, and you get notified instantly!",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-text mb-3">
                  {item.title}
                </h3>
                <p className="text-text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="bg-accent rounded-lg p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to digitize your restaurant?
            </h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              Join 50+ restaurants already using {APP_CONFIG.appName} to
              streamline their operations
            </p>
            <Link to="/register">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-accent hover:bg-white/90"
              >
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Store className="w-6 h-6 text-accent" />
                <span className="text-lg font-bold text-text">
                  {APP_CONFIG.appName}
                </span>
              </div>
              <p className="text-sm text-text-secondary">
                Digital ordering made simple for restaurants
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-text mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-sm text-text-secondary hover:text-text"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-sm text-text-secondary hover:text-text"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-sm text-text-secondary hover:text-text"
                  >
                    How it Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-text-secondary hover:text-text"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-text-secondary hover:text-text"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-text-secondary hover:text-text"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-text-secondary hover:text-text"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-text-secondary hover:text-text"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-text-secondary">
            © {new Date().getFullYear()} {APP_CONFIG.appName}. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
