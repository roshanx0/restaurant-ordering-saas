import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, Mail, Lock } from "lucide-react";
import { Button, Input, Alert, Card } from "../../components/ui";
import { supabase } from "../../config/supabase";
import { isValidEmail, hashPassword } from "../../utils/helpers";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Hash password and use RPC function for admin login
      const passwordHash = await hashPassword(formData.password);
      const { data: adminData, error: adminError } = await supabase.rpc(
        "admin_login",
        {
          p_email: formData.email.toLowerCase(),
          p_password_hash: passwordHash,
        }
      );

      if (adminError) {
        console.error("Admin login RPC error:", adminError);
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      if (!adminData || adminData.length === 0) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      const admin = adminData[0];

      // Login successful - store admin data
      localStorage.setItem(
        "admin",
        JSON.stringify({
          id: admin.id,
          email: admin.email,
          name: admin.name,
        })
      );

      // Redirect to admin dashboard
      navigate("/admin");
    } catch (err: any) {
      console.error("Admin login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-text-secondary hover:text-text mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <Card>
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/5 mb-4">
              <Shield className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-text mb-2">Admin Login</h1>
            <p className="text-text-secondary">Access the admin panel</p>
          </div>

          {/* Error Alert */}
          {error && <Alert type="error" message={error} className="mb-6" />}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              icon={<Mail className="w-5 h-5" />}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              icon={<Lock className="w-5 h-5" />}
              required
              autoComplete="current-password"
            />

            <Button type="submit" loading={loading} fullWidth size="lg">
              Login as Admin
            </Button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-bg-subtle rounded-lg">
            <p className="text-sm text-text-secondary">
              <strong>Default credentials:</strong>
              <br />
              Email: admin@foodorder.com
              <br />
              Password: admin123
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
