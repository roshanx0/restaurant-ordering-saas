import React, { useEffect, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Store as StoreIcon,
  CheckCircle,
  X,
  Clock,
  AlertCircle,
  Copy,
} from "lucide-react";
import {
  Card,
  Button,
  Modal,
  Input,
  Select,
  Textarea,
  Alert,
  Badge,
  Loading,
} from "../../components/ui";
import {
  subscribeToPendingRequests,
  createRestaurantAccount,
  rejectRegistrationRequest,
} from "../../services/adminService";
import type { RegistrationRequest } from "../../config/supabase";
import { formatDateTime, copyToClipboard } from "../../utils/helpers";
import { APP_CONFIG } from "../../config/config";

const PendingRequests: React.FC = () => {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] =
    useState<RegistrationRequest | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentials, setCredentials] = useState<any>(null);

  // Real-time subscription
  useEffect(() => {
    const subscription = subscribeToPendingRequests((data) => {
      setRequests(data);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleCreateAccount = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setShowCreateModal(true);
  };

  const handleReject = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  if (loading) {
    return <Loading text="Loading pending requests..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text mb-2">
            Pending Requests
          </h2>
          <p className="text-text-secondary">
            Review and approve restaurant registrations
          </p>
        </div>
        <Badge variant="warning" className="text-lg px-4 py-2">
          {requests.length} Pending
        </Badge>
      </div>

      {/* Real-time indicator */}
      {requests.length > 0 && (
        <div className="flex items-center space-x-2 text-sm text-success">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span>Live updates enabled</span>
        </div>
      )}

      {/* Requests List */}
      {requests.length === 0 ? (
        <Card className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text mb-2">
            All Caught Up!
          </h3>
          <p className="text-text-secondary">
            No pending registration requests at the moment.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <Card
              key={request.id}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Request Details */}
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-text mb-1">
                        {request.restaurant_name}
                      </h3>
                      <Badge variant="neutral">{request.restaurant_type}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-text-secondary flex items-center justify-end">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDateTime(request.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 text-text-secondary">
                      <StoreIcon className="w-4 h-4" />
                      <span className="font-medium text-text">
                        {request.owner_name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-text-secondary">
                      <Phone className="w-4 h-4" />
                      <a
                        href={`tel:${request.phone}`}
                        className="text-accent hover:underline"
                      >
                        {request.phone}
                      </a>
                    </div>
                    {request.email && (
                      <div className="flex items-center space-x-2 text-text-secondary">
                        <Mail className="w-4 h-4" />
                        <a
                          href={`mailto:${request.email}`}
                          className="text-accent hover:underline truncate"
                        >
                          {request.email}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-text-secondary">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {request.city}
                        {request.address && `, ${request.address}`}
                      </span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(request.heard_from || request.notes) && (
                    <div className="bg-bg-subtle rounded-lg p-3 space-y-2 text-sm">
                      {request.heard_from && (
                        <p className="text-text-secondary">
                          <strong className="text-text">Heard from:</strong>{" "}
                          {request.heard_from}
                        </p>
                      )}
                      {request.notes && (
                        <p className="text-text-secondary">
                          <strong className="text-text">Notes:</strong>{" "}
                          {request.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 md:min-w-[140px]">
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    icon={<CheckCircle className="w-4 h-4" />}
                    onClick={() => handleCreateAccount(request)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    icon={<X className="w-4 h-4" />}
                    onClick={() => handleReject(request)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Account Modal */}
      <CreateAccountModal
        isOpen={showCreateModal}
        request={selectedRequest}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedRequest(null);
        }}
        onSuccess={(creds) => {
          setShowCreateModal(false);
          setCredentials(creds);
          setShowCredentialsModal(true);
        }}
      />

      {/* Reject Modal */}
      <RejectModal
        isOpen={showRejectModal}
        request={selectedRequest}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedRequest(null);
        }}
      />

      {/* Credentials Display Modal */}
      <CredentialsModal
        isOpen={showCredentialsModal}
        credentials={credentials}
        onClose={() => {
          setShowCredentialsModal(false);
          setCredentials(null);
        }}
      />
    </div>
  );
};

// Create Account Modal Component
interface CreateAccountModalProps {
  isOpen: boolean;
  request: RegistrationRequest | null;
  onClose: () => void;
  onSuccess: (credentials: any) => void;
}

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  request,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    subscriptionPlan: "free_trial",
    internalNotes: "",
    sendViaSMS: true,
    sendViaWhatsApp: true,
    sendViaEmail: true,
  });

  useEffect(() => {
    if (request) {
      setFormData((prev) => ({
        ...prev,
        email: request.email || "",
      }));
    }
  }, [request]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email) {
      setError("Email is required");
      return;
    }

    if (!request) return;

    setLoading(true);
    const result = await createRestaurantAccount(request.id, {
      email: formData.email,
      subscriptionPlan: formData.subscriptionPlan,
      internalNotes: formData.internalNotes,
    });

    setLoading(false);

    if (result.success && result.credentials) {
      onSuccess(result.credentials);
    } else {
      setError(result.error || "Failed to create account");
    }
  };

  if (!request) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Restaurant Account"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert type="error" message={error} />}

        {/* Restaurant Info */}
        <div className="bg-bg-subtle rounded-lg p-4">
          <h4 className="font-semibold text-text mb-2">Restaurant Details</h4>
          <div className="space-y-1 text-sm">
            <p className="text-text">
              <strong>Name:</strong> {request.restaurant_name}
            </p>
            <p className="text-text-secondary">
              <strong>Owner:</strong> {request.owner_name}
            </p>
            <p className="text-text-secondary">
              <strong>Phone:</strong> {request.phone}
            </p>
            <p className="text-text-secondary">
              <strong>City:</strong> {request.city}
            </p>
          </div>
        </div>

        {/* Account Details */}
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="owner@restaurant.com"
          required
          helperText="This will be used for login"
        />

        <Select
          label="Subscription Plan"
          value={formData.subscriptionPlan}
          onChange={(e) =>
            setFormData({ ...formData, subscriptionPlan: e.target.value })
          }
          options={Object.keys(APP_CONFIG.plans).map((key) => ({
            value: key,
            label: APP_CONFIG.plans[key as keyof typeof APP_CONFIG.plans].name,
          }))}
        />

        <Textarea
          label="Internal Notes (Optional)"
          value={formData.internalNotes}
          onChange={(e) =>
            setFormData({ ...formData, internalNotes: e.target.value })
          }
          placeholder="Add any internal notes..."
          rows={2}
        />

        {/* Send Credentials Via */}
        <div>
          <label className="label mb-3">Send Credentials Via</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sendViaSMS}
                onChange={(e) =>
                  setFormData({ ...formData, sendViaSMS: e.target.checked })
                }
                className="rounded border-border"
              />
              <span className="text-text">SMS</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sendViaWhatsApp}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sendViaWhatsApp: e.target.checked,
                  })
                }
                className="rounded border-border"
              />
              <span className="text-text">WhatsApp</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sendViaEmail}
                onChange={(e) =>
                  setFormData({ ...formData, sendViaEmail: e.target.checked })
                }
                className="rounded border-border"
              />
              <span className="text-text">Email</span>
            </label>
          </div>
        </div>

        {/* Info */}
        <div className="bg-accent-secondary/10 border border-accent-secondary/20 rounded-lg p-3 text-sm">
          <AlertCircle className="w-4 h-4 text-accent-secondary inline mr-2" />
          <span className="text-text-secondary">
            A temporary password will be generated and sent to the restaurant.
            They can change it after first login.
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button type="submit" loading={loading} fullWidth>
            Create Account & Send Credentials
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Reject Modal Component
interface RejectModalProps {
  isOpen: boolean;
  request: RegistrationRequest | null;
  onClose: () => void;
}

const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  request,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleReject = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    if (!request) return;

    setLoading(true);
    const success = await rejectRegistrationRequest(request.id, reason);
    setLoading(false);

    if (success) {
      onClose();
      setReason("");
    } else {
      setError("Failed to reject request");
    }
  };

  if (!request) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Registration"
      size="md"
    >
      <div className="space-y-4">
        {error && <Alert type="error" message={error} />}

        <p className="text-text-secondary">
          Are you sure you want to reject the registration for{" "}
          <strong className="text-text">{request.restaurant_name}</strong>?
        </p>

        <Textarea
          label="Reason for Rejection"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError("");
          }}
          placeholder="Please provide a reason..."
          required
          rows={3}
        />

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleReject}
            loading={loading}
            fullWidth
          >
            Reject Registration
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Credentials Display Modal
interface CredentialsModalProps {
  isOpen: boolean;
  credentials: any;
  onClose: () => void;
}

const CredentialsModal: React.FC<CredentialsModalProps> = ({
  isOpen,
  credentials,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `Login Credentials:\n\nEmail: ${credentials?.email}\nPassword: ${credentials?.password}\nLogin URL: ${credentials?.loginUrl}`;
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!credentials) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Account Created Successfully!"
      size="md"
    >
      <div className="space-y-6">
        {/* Success Message */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <p className="text-text-secondary">
            Restaurant account has been created and credentials have been sent.
          </p>
        </div>

        {/* Credentials */}
        <div className="bg-bg-subtle rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-text mb-3">Login Credentials</h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-text-secondary">Email</label>
              <p className="font-mono text-text">{credentials.email}</p>
            </div>
            <div>
              <label className="text-xs text-text-secondary">
                Temporary Password
              </label>
              <p className="font-mono text-text font-bold">
                {credentials.password}
              </p>
            </div>
            <div>
              <label className="text-xs text-text-secondary">Login URL</label>
              <p className="font-mono text-text text-sm break-all">
                {credentials.loginUrl}
              </p>
            </div>
          </div>
        </div>

        {/* Copy Button */}
        <Button
          variant="outline"
          fullWidth
          icon={<Copy className="w-4 h-4" />}
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy All Credentials"}
        </Button>

        {/* Info */}
        <div className="bg-accent-secondary/10 border border-accent-secondary/20 rounded-lg p-3 text-sm">
          <AlertCircle className="w-4 h-4 text-accent-secondary inline mr-2" />
          <span className="text-text-secondary">
            These credentials have been sent to the restaurant via their
            selected channels (SMS/WhatsApp/Email).
          </span>
        </div>

        <Button onClick={onClose} fullWidth>
          Done
        </Button>
      </div>
    </Modal>
  );
};

export default PendingRequests;
