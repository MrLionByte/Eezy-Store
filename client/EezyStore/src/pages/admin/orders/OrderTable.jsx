import { Eye, RefreshCw } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";

export default function OrdersTable({ 
  filteredOrders, 
  loading, 
  setSelectedOrder, 
  setAddressDialog, 
  setStatusDialog ,
  fetchOrderDetails
}) {
  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center py-8">
          Loading orders...
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Items</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredOrders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              No orders found matching your criteria
            </TableCell>
          </TableRow>
        ) : (
          filteredOrders?.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell>
                <div>
                  <div>{order.user.username}</div>
                  <div className="text-sm text-muted-foreground hidden sm:block">{order.user.email}</div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
              </TableCell>
              <TableCell className="text-right">${parseFloat(order.total_amount)?.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setAddressDialog(true);
                      fetchOrderDetails(order.id)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-2">Details</span>
                  </Button>
                  {order.status !== 'delivered' &&
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setStatusDialog(true);
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-2">Status</span>
                  </Button>
                    }
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}