import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "./StatusBadge";
import OrderStatusUpdate from "./OrderStatusUpdate";

export default function StatusUpdateDialog({ 
  selectedOrder, 
  statusDialog, 
  setStatusDialog, 
  updatingStatus, 
  handleStatusChange 
}) {
  const [newStatus, setNewStatus] = useState(selectedOrder?.status || "approved");
  const [statusNote, setStatusNote] = useState("");
  
  const onStatusChange = async () => {
    await handleStatusChange(selectedOrder.id, newStatus);
  };
  
  return (
    <Dialog open={statusDialog} onOpenChange={setStatusDialog}>
      <DialogContent className="max-w-md">
        {updatingStatus ? (
          <OrderStatusUpdate onClose={() => {}} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Change the status for order #{selectedOrder?.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="mb-4">
                <Label htmlFor="current-status">Current Status</Label>
                <div className="mt-1">
                  <StatusBadge status={selectedOrder?.status} />
                </div>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="new-status">New Status</Label>
                <Select 
                  defaultValue={selectedOrder?.status} 
                  value={newStatus}
                  onValueChange={setNewStatus}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedOrder?.status === 'approved' ? 
                        <SelectItem value="shipped">Shipped</SelectItem>
                        :
                        <SelectItem value="delivered">Delivered</SelectItem>
                    }
                  </SelectContent>
                </Select>
              </div>

            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusDialog(false)}>
                Cancel
              </Button>
              <Button onClick={onStatusChange}>
                Update Status
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}