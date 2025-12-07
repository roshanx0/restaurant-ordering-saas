import React, { useState, useEffect } from "react";
import { Download, QrCode as QrCodeIcon, ExternalLink } from "lucide-react";
import { Card, Button, Loading, Alert } from "../../components/ui";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "../../config/supabase";
import type { Restaurant } from "../../config/supabase";

const RestaurantSettings: React.FC = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.restaurant_id) {
          setError("Restaurant ID not found");
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("restaurants")
          .select("*")
          .eq("id", user.restaurant_id)
          .single();

        if (fetchError) throw fetchError;
        setRestaurant(data);
      } catch (err) {
        setError("Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  const downloadQRCode = () => {
    if (!restaurant) return;

    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `${restaurant.slug}-qr-code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (loading) {
    return <Loading text="Loading settings..." />;
  }

  if (error || !restaurant) {
    return <Alert type="error" message={error || "Restaurant not found"} />;
  }

  const menuUrl = `${window.location.origin}/menu/${restaurant.slug}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text mb-2">Settings</h2>
        <p className="text-text-secondary">
          Manage your restaurant QR code and menu access
        </p>
      </div>

      {/* QR Code Section */}
      <Card>
        <div className="flex items-start space-x-2 mb-4">
          <QrCodeIcon className="w-6 h-6 text-accent" />
          <div>
            <h3 className="text-xl font-bold text-text">Menu QR Code</h3>
            <p className="text-text-secondary text-sm">
              Customers can scan this QR code to access your menu
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* QR Code Display */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <QRCodeSVG
                id="qr-code-svg"
                value={menuUrl}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>

            <Button
              icon={<Download className="w-5 h-5" />}
              onClick={downloadQRCode}
              fullWidth
            >
              Download QR Code
            </Button>
          </div>

          {/* QR Code Info */}
          <div className="space-y-4">
            <div>
              <label className="label mb-2">Restaurant Name</label>
              <div className="p-3 bg-bg-subtle rounded-lg text-text font-medium">
                {restaurant.name}
              </div>
            </div>

            <div>
              <label className="label mb-2">Menu URL</label>
              <div className="p-3 bg-bg-subtle rounded-lg break-all text-text-secondary text-sm">
                {menuUrl}
              </div>
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-accent hover:text-accent-secondary mt-2 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open menu page</span>
              </a>
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <h4 className="font-semibold text-text mb-2">How to use:</h4>
              <ol className="space-y-2 text-text-secondary text-sm">
                <li>1. Download the QR code image</li>
                <li>2. Print and place it on tables, counter, or entrance</li>
                <li>3. Customers scan with their phone camera</li>
                <li>4. They'll instantly access your live menu</li>
              </ol>
            </div>

            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <p className="text-success text-sm">
                ✓ Menu updates automatically reflect in real-time
              </p>
              <p className="text-success text-sm">
                ✓ No app installation required for customers
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Additional Settings Placeholder */}
      <Card className="bg-bg-subtle">
        <h3 className="text-lg font-bold text-text mb-3">
          Additional Settings (Coming Soon)
        </h3>
        <ul className="space-y-2 text-text-secondary text-sm">
          <li>• Update restaurant profile and contact info</li>
          <li>• Upload logo and cover images</li>
          <li>• Customize ordering page theme</li>
          <li>• Set business hours and holidays</li>
          <li>• Configure tax rates and payment methods</li>
          <li>• Change password and security settings</li>
        </ul>
      </Card>
    </div>
  );
};

export default RestaurantSettings;
