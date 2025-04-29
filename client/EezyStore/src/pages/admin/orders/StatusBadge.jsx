import { CheckCircle, Clock, Truck } from "lucide-react";

export function StatusBadge({ status }) {
  const statusConfig = {
    approved: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-4 h-4 mr-1" /> },
    shipped: { color: "bg-indigo-100 text-indigo-800", icon: <Truck className="w-4 h-4 mr-1" /> },
    delivered: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-4 h-4 mr-1" /> },
    };

  const config = statusConfig[status] || statusConfig.approved;

  return (
    <div className={`flex items-center px-2 py-1 rounded-full ${config.color}`}>
      {config.icon}
      <span className="capitalize">{status}</span>
    </div>
  );
}