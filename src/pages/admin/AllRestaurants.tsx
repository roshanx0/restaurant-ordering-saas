import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  Store as StoreIcon,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Crown,
} from "lucide-react";
import {
  Card,
  Button,
  Input,
  Badge,
  Loading,
  Modal,
  Select,
  Textarea,
} from "../../components/ui";
import {
  subscribeToRestaurants,
  toggleRestaurantStatus,
} from "../../services/adminService";
import type { Restaurant } from "../../config/supabase";
import { formatDateTime } from "../../utils/helpers";
import { APP_CONFIG } from "../../config/config";

const AllRestaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  // Real-time subscription
  useEffect(() => {
    const subscription = subscribeToRestaurants((data) => {
      setRestaurants(data);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Filter restaurants
  useEffect(() => {
    let filtered = restaurants;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.owner_name?.toLowerCase().includes(term) ||
          r.phone?.toLowerCase().includes(term) ||
          r.city?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    setFilteredRestaurants(filtered);
  }, [restaurants, searchTerm, statusFilter]);

  const handleViewDetails = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailsModal(true);
  };

  const handleToggleBlock = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowBlockModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "blocked":
        return <Badge variant="error">Blocked</Badge>;
      case "trial":
        return <Badge variant="warning">Trial</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    const planConfig = APP_CONFIG.plans[plan as keyof typeof APP_CONFIG.plans];
    if (!planConfig) return null;

    return (
      <Badge
        variant={plan === "enterprise" ? "success" : "neutral"}
        className="flex items-center space-x-1"
      >
        {plan === "enterprise" && <Crown className="w-3 h-3" />}
        <span>{planConfig.name}</span>
      </Badge>
    );
  };

  if (loading) {
    return <Loading text="Loading restaurants..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text mb-2">All Restaurants</h2>
          <p className="text-text-secondary">
            Manage all registered restaurants
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="neutral" className="text-lg px-4 py-2">
            {restaurants.length} Total
          </Badge>
          <Badge variant="success" className="text-lg px-4 py-2">
            {restaurants.filter((r) => r.status === "active").length} Active
          </Badge>
        </div>
      </div>

      {/* Real-time indicator */}
      <div className="flex items-center space-x-2 text-sm text-success">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
        <span>Live updates enabled</span>
      </div>

      {/* Filters */}
      <Card className="!p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, owner, phone, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="sm:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "blocked", label: "Blocked" },
                { value: "trial", label: "Trial" },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Restaurants List */}
      {filteredRestaurants.length === 0 ? (
        <Card className="text-center py-12">
          <StoreIcon className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-text mb-2">
            No Restaurants Found
          </h3>
          <p className="text-text-secondary">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "No restaurants registered yet"}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRestaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Restaurant Info */}
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-bold text-text">
                          {restaurant.name}
                        </h3>
                        {getStatusBadge(restaurant.status)}
                        {restaurant.subscription_plan &&
                          getPlanBadge(restaurant.subscription_plan)}
                      </div>
                      <p className="text-sm text-text-secondary">
                        {restaurant.restaurant_type}
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                    {restaurant.owner_name && (
                      <div className="flex items-center space-x-2 text-text-secondary">
                        <StoreIcon className="w-4 h-4" />
                        <span className="text-text">
                          {restaurant.owner_name}
                        </span>
                      </div>
                    )}
                    {restaurant.phone && (
                      <div className="flex items-center space-x-2 text-text-secondary">
                        <Phone className="w-4 h-4" />
                        <a
                          href={`tel:${restaurant.phone}`}
                          className="text-accent hover:underline"
                        >
                          {restaurant.phone}
                        </a>
                      </div>
                    )}
                    {restaurant.email && (
                      <div className="flex items-center space-x-2 text-text-secondary">
                        <Mail className="w-4 h-4" />
                        <a
                          href={`mailto:${restaurant.email}`}
                          className="text-accent hover:underline truncate"
                        >
                          {restaurant.email}
                        </a>
                      </div>
                    )}
                    {restaurant.city && (
                      <div className="flex items-center space-x-2 text-text-secondary">
                        <MapPin className="w-4 h-4" />
                        <span>{restaurant.city}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateTime(restaurant.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 md:min-w-[140px]">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    icon={<Eye className="w-4 h-4" />}
                    onClick={() => handleViewDetails(restaurant)}
                  >
                    View
                  </Button>
                  <Button
                    variant={
                      restaurant.status === "blocked" ? "secondary" : "danger"
                    }
                    size="sm"
                    fullWidth
                    icon={
                      restaurant.status === "blocked" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Ban className="w-4 h-4" />
                      )
                    }
                    onClick={() => handleToggleBlock(restaurant)}
                  >
                    {restaurant.status === "blocked" ? "Unblock" : "Block"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Details Modal */}
      <DetailsModal
        isOpen={showDetailsModal}
        restaurant={selectedRestaurant}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedRestaurant(null);
        }}
      />

      {/* Block/Unblock Modal */}
      <BlockModal
        isOpen={showBlockModal}
        restaurant={selectedRestaurant}
        onClose={() => {
          setShowBlockModal(false);
          setSelectedRestaurant(null);
        }}
      />
    </div>
  );
};

// Details Modal Component
interface DetailsModalProps {
  isOpen: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  restaurant,
  onClose,
}) => {
  if (!restaurant) return null;

  const planConfig =
    APP_CONFIG.plans[
      restaurant.subscription_plan as keyof typeof APP_CONFIG.plans
    ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Restaurant Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-text mb-2">
              {restaurant.name}
            </h3>
            <div className="flex items-center space-x-2">
              <Badge variant="neutral">{restaurant.restaurant_type}</Badge>
              {restaurant.subscription_plan && planConfig && (
                <Badge variant="success">{planConfig.name}</Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            {restaurant.status === "active" ? (
              <Badge variant="success">Active</Badge>
            ) : restaurant.status === "blocked" ? (
              <Badge variant="error">Blocked</Badge>
            ) : (
              <Badge variant="warning">{restaurant.status}</Badge>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoItem label="Owner Name" value={restaurant.owner_name} />
          <InfoItem
            label="Phone"
            value={restaurant.phone}
            link={`tel:${restaurant.phone}`}
          />
          <InfoItem
            label="Email"
            value={restaurant.email}
            link={`mailto:${restaurant.email}`}
          />
          <InfoItem label="City" value={restaurant.city} />
          <InfoItem label="Address" value={restaurant.address} fullWidth />
          <InfoItem
            label="Registered On"
            value={formatDateTime(restaurant.created_at)}
          />
          <InfoItem
            label="Last Updated"
            value={formatDateTime(restaurant.updated_at)}
          />
        </div>

        {/* Subscription Details */}
        {planConfig && (
          <div className="bg-bg-subtle rounded-lg p-4">
            <h4 className="font-semibold text-text mb-3">
              Subscription Details
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-text-secondary">
                <strong className="text-text">Plan:</strong> {planConfig.name}{" "}
                (${planConfig.price}/month)
              </p>
              <p className="text-text-secondary">
                <strong className="text-text">Features:</strong>{" "}
                {planConfig.features.join(", ")}
              </p>
              {restaurant.trial_ends_at && (
                <p className="text-warning">
                  <strong>Trial Ends:</strong>{" "}
                  {formatDateTime(restaurant.trial_ends_at)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Internal Notes */}
        {restaurant.internal_notes && (
          <div className="bg-bg-subtle rounded-lg p-4">
            <h4 className="font-semibold text-text mb-2">Internal Notes</h4>
            <p className="text-text-secondary text-sm">
              {restaurant.internal_notes}
            </p>
          </div>
        )}

        {/* Block Reason (if blocked) */}
        {restaurant.status === "blocked" && restaurant.block_reason && (
          <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
            <h4 className="font-semibold text-danger mb-2">Block Reason</h4>
            <p className="text-text-secondary text-sm">
              {restaurant.block_reason}
            </p>
          </div>
        )}

        <Button onClick={onClose} fullWidth>
          Close
        </Button>
      </div>
    </Modal>
  );
};

// Block Modal Component
interface BlockModalProps {
  isOpen: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
}

const BlockModal: React.FC<BlockModalProps> = ({
  isOpen,
  restaurant,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const isBlocked = restaurant?.status === "blocked";

  const handleToggle = async () => {
    if (!isBlocked && !reason.trim()) {
      setError("Please provide a reason for blocking");
      return;
    }

    if (!restaurant) return;

    setLoading(true);
    const success = await toggleRestaurantStatus(
      restaurant.id,
      isBlocked,
      reason
    );
    setLoading(false);

    if (success) {
      onClose();
      setReason("");
    } else {
      setError(`Failed to ${isBlocked ? "unblock" : "block"} restaurant`);
    }
  };

  if (!restaurant) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isBlocked ? "Unblock Restaurant" : "Block Restaurant"}
      size="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <p className="text-text-secondary">
          {isBlocked ? (
            <>
              Are you sure you want to unblock{" "}
              <strong className="text-text">{restaurant.name}</strong>? They
              will regain access to their dashboard.
            </>
          ) : (
            <>
              Are you sure you want to block{" "}
              <strong className="text-text">{restaurant.name}</strong>? They
              will lose access to their dashboard immediately.
            </>
          )}
        </p>

        {!isBlocked && (
          <Textarea
            label="Reason for Blocking"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            placeholder="Please provide a reason..."
            required
            rows={3}
          />
        )}

        {isBlocked && restaurant.block_reason && (
          <div className="bg-bg-subtle rounded-lg p-3 text-sm">
            <p className="text-text-secondary">
              <strong className="text-text">Previously blocked for:</strong>{" "}
              {restaurant.block_reason}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button
            variant={isBlocked ? "secondary" : "danger"}
            onClick={handleToggle}
            loading={loading}
            fullWidth
          >
            {isBlocked ? "Unblock Restaurant" : "Block Restaurant"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Helper Component
interface InfoItemProps {
  label: string;
  value?: string | null;
  link?: string;
  fullWidth?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  link,
  fullWidth,
}) => {
  if (!value) return null;

  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <label className="text-xs text-text-secondary">{label}</label>
      {link ? (
        <a href={link} className="block text-text hover:text-accent truncate">
          {value}
        </a>
      ) : (
        <p className="text-text">{value}</p>
      )}
    </div>
  );
};

export default AllRestaurants;
