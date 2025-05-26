import { useState, useEffect } from "react";
import { AdminOrderService } from "../../../services/apiService";

export function useOrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [addressDialog, setAddressDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await AdminOrderService.list();
        
        setOrders(data.orders); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const updatedOrder = await AdminOrderService.change(orderId, newStatus);

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setTimeout(() => {
        setUpdatingStatus(false);
        setStatusDialog(false);
      }, 2800); 
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const order = await AdminOrderService.details(orderId);
      
      setSelectedOrder(order);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    orders,
    loading,
    error,
    selectedOrder,
    setSelectedOrder,
    addressDialog,
    setAddressDialog,
    statusDialog,
    setStatusDialog,
    updatingStatus,
    setUpdatingStatus,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredOrders,
    handleStatusChange,
    fetchOrderDetails, 
  };
}


