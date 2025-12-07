import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "../components/ui";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-text mb-4">Page Not Found</h2>
        <p className="text-text-secondary mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button icon={<Home className="w-5 h-5" />}>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
