import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Store, ArrowLeft, CheckCircle } from "lucide-react";
import {
  Button,
  Input,
  Select,
  Textarea,
  Alert,
  Card,
} from "../../components/ui";
import { APP_CONFIG } from "../../config/config";
import { supabase } from "../../config/supabase";
import { isValidEmail, isValidPhone } from "../../utils/helpers";

interface FormData {
  restaurant_name: string;
  owner_name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  restaurant_type: string;
  heard_from: string;
  notes: string;
}

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    restaurant_name: "",
    owner_name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    restaurant_type: "",
    heard_from: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.restaurant_name.trim()) {
      newErrors.restaurant_name = "Restaurant name is required";
    }

    if (!formData.owner_name.trim()) {
      newErrors.owner_name = "Owner name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.restaurant_type) {
      newErrors.restaurant_type = "Restaurant type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Insert registration request into Supabase
      const { error: insertError } = await supabase
        .from("registration_requests")
        .insert([
          {
            restaurant_name: formData.restaurant_name.trim(),
            owner_name: formData.owner_name.trim(),
            phone: formData.phone.replace(/[\s\-()]/g, ""),
            email: formData.email.trim() || null,
            city: formData.city.trim(),
            address: formData.address.trim() || null,
            restaurant_type: formData.restaurant_type,
            heard_from: formData.heard_from || null,
            notes: formData.notes.trim() || null,
            status: "pending",
          },
        ])
        .select();

      if (insertError) {
        throw insertError;
      }

      // Success!
      setSuccess(true);

      // TODO: In production, send confirmation email to restaurant
      // TODO: Send notification to admin panel
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.message || "Failed to submit registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Success Screen
  if (success) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <Card className="max-w-lg w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-text mb-3">
            Registration Submitted!
          </h1>
          <p className="text-text-secondary mb-6">
            Thank you for your interest in {APP_CONFIG.appName}! Our team will
            verify your details and contact you within 24 hours on{" "}
            <strong>{formData.phone}</strong>
            {formData.email && ` and ${formData.email}`}.
          </p>
          <div className="space-y-3">
            <div className="bg-bg-subtle rounded-lg p-4 text-left">
              <h3 className="font-semibold text-text mb-2">
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start">
                  <span className="text-accent mr-2">1.</span>
                  <span>Our team reviews your registration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">2.</span>
                  <span>
                    We call you to verify details and explain the process
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">3.</span>
                  <span>
                    Once verified, you'll receive login credentials via
                    SMS/WhatsApp
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">4.</span>
                  <span>Start your 14-day free trial immediately!</span>
                </li>
              </ul>
            </div>
            <Link to="/">
              <Button variant="outline" fullWidth>
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-text-secondary hover:text-text mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <Store className="w-10 h-10 text-accent" />
            <div>
              <h1 className="text-3xl font-bold text-text">
                Register Your Restaurant
              </h1>
              <p className="text-text-secondary">
                Start your digital journey today
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card>
          {error && <Alert type="error" message={error} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Restaurant Details */}
            <div>
              <h2 className="text-lg font-semibold text-text mb-4">
                Restaurant Details
              </h2>
              <div className="space-y-4">
                <Input
                  label="Restaurant Name"
                  name="restaurant_name"
                  value={formData.restaurant_name}
                  onChange={handleChange}
                  error={errors.restaurant_name}
                  placeholder="e.g., Tasty Bites Restaurant"
                  required
                />

                <Select
                  label="Restaurant Type"
                  name="restaurant_type"
                  value={formData.restaurant_type}
                  onChange={handleChange}
                  error={errors.restaurant_type}
                  options={APP_CONFIG.restaurantTypes.map((type) => ({
                    value: type,
                    label: type,
                  }))}
                  required
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={errors.city}
                    placeholder="e.g., Mumbai"
                    required
                  />

                  <Input
                    label="Address (Optional)"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address"
                  />
                </div>
              </div>
            </div>

            {/* Owner Details */}
            <div>
              <h2 className="text-lg font-semibold text-text mb-4">
                Owner Details
              </h2>
              <div className="space-y-4">
                <Input
                  label="Owner Name"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  error={errors.owner_name}
                  placeholder="Your full name"
                  required
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="10-digit mobile number"
                    required
                  />

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h2 className="text-lg font-semibold text-text mb-4">
                Additional Information
              </h2>
              <div className="space-y-4">
                <Select
                  label="How did you hear about us?"
                  name="heard_from"
                  value={formData.heard_from}
                  onChange={handleChange}
                  options={APP_CONFIG.heardFromOptions.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                />

                <Textarea
                  label="Additional Notes (Optional)"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any specific requirements or questions..."
                  rows={3}
                />
              </div>
            </div>

            {/* Terms */}
            <div className="bg-bg-subtle rounded-lg p-4 text-sm text-text-secondary">
              By submitting this form, you agree to our Terms of Service and
              Privacy Policy. Our team will contact you within 24 hours to
              verify your details.
            </div>

            {/* Submit Button */}
            <Button type="submit" loading={loading} fullWidth size="lg">
              Submit Registration
            </Button>

            {/* Login Link */}
            <p className="text-center text-sm text-text-secondary">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-accent font-medium hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
