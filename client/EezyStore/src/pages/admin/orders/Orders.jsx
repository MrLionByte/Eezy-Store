import { Search, Filter, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrdersTable from "./OrderTable";
import OrderDetailsDialog from "./OrderDetailsDialog";
import StatusUpdateDialog from "./StatusUpdateDialog";
import { useOrdersManagement } from "./_lib";

export default function AdminOrdersPage() {
  const {
    filteredOrders,
    orders,
    selectedOrder,
    addressDialog,
    statusDialog,
    updatingStatus,
    searchTerm,
    statusFilter,
    loading,
    setSearchTerm,
    setStatusFilter,
    setSelectedOrder,
    setAddressDialog,
    setStatusDialog,
    handleStatusChange,
    fetchOrderDetails
  } = useOrdersManagement();

  
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="w-full sm:w-64 pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" /> 
              Orders Management
            </CardTitle>
            <CardDescription>Manage all customer orders from this dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
          <OrdersTable 
            filteredOrders={filteredOrders} 
            loading={loading} 
            setSelectedOrder={setSelectedOrder}
            setAddressDialog={setAddressDialog}
            setStatusDialog={setStatusDialog}
            fetchOrderDetails={fetchOrderDetails}
          />

          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </CardFooter>
        </Card>
        
        {selectedOrder && (
          <>
            <OrderDetailsDialog 
              selectedOrder={selectedOrder}
              addressDialog={addressDialog}
              setAddressDialog={setAddressDialog}
              setStatusDialog={setStatusDialog}
            />
            
            <StatusUpdateDialog 
              selectedOrder={selectedOrder}
              statusDialog={statusDialog}
              setStatusDialog={setStatusDialog}
              updatingStatus={updatingStatus}
              handleStatusChange={handleStatusChange}
            />
          </>
        )}
      </div>
    </>
  );
}