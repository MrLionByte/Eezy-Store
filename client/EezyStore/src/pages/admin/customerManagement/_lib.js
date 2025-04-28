import { useState, useEffect } from "react";
import { adminCustomerService } from "../../../services/apiService";

export const useCustomerManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [fetchFromServer, setFetchFromBackend] = useState(true);

  const getCustomers = async () => {
    try {
      const response = await adminCustomerService.list();
      setUsers(response.results);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchFromServer){
        getCustomers();
        setFetchFromBackend(false);
    }
  }, [fetchFromServer]);

  const handleApproveUser = async (userId, userName) => {
    try {
        const response = await adminCustomerService.approve(userId, userName);
        setFetchFromBackend(true);
    } catch(err){
        setError(err)
    } finally {
        setLoading(false)
    }
    }

  const handleBlockUser = async (userId) => {
    try {
      const response = await adminCustomerService.block(userId)
      setFetchFromBackend(true)

    } catch (err) {
      setError(err);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
     const response = await adminCustomerService.unBlock(userId);
     setFetchFromBackend(true)
    } catch (err) {
      setError(err);
    }
  };

  const openDetailsDialog = (user) => {
    setSelectedUser(user);
    setIsDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setSelectedUser(null);
    setIsDetailsDialogOpen(false);
  };

  return {
    users,
    loading,
    error,
    selectedUser,
    isDetailsDialogOpen,
    openDetailsDialog,
    closeDetailsDialog,
    handleApproveUser,
    handleBlockUser,
    handleUnblockUser,
  };
};
