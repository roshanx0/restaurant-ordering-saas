import React from "react";
import { TrendingUp, DollarSign, ShoppingCart, Users } from "lucide-react";
import { Card } from "../../components/ui";

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text mb-2">Analytics</h2>
        <p className="text-text-secondary">Platform performance and insights</p>
      </div>

      {/* Coming Soon */}
      <Card className="text-center py-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center space-x-4 mb-6">
            <TrendingUp className="w-12 h-12 text-accent opacity-50" />
            <DollarSign className="w-12 h-12 text-success opacity-50" />
            <ShoppingCart className="w-12 h-12 text-accent-secondary opacity-50" />
            <Users className="w-12 h-12 text-warning opacity-50" />
          </div>
          <h3 className="text-2xl font-bold text-text mb-3">
            Analytics Dashboard Coming Soon
          </h3>
          <p className="text-text-secondary text-lg mb-6">
            Advanced reporting and insights are under development.
          </p>
          <div className="bg-bg-subtle rounded-lg p-6 text-left">
            <h4 className="font-semibold text-text mb-3">Planned Features:</h4>
            <ul className="space-y-2 text-text-secondary">
              <li>• Revenue trends and forecasting</li>
              <li>• Restaurant performance comparison</li>
              <li>• Order analytics and peak hours</li>
              <li>• Customer behavior insights</li>
              <li>• Subscription metrics and churn analysis</li>
              <li>• Export reports (PDF/Excel)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
