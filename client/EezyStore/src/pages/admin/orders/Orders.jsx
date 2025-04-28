import { AppSidebar } from "../../../components/dashboard/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Eye, 
  Filter, 
  Package, 
  Search, 
  RefreshCw,
  CheckCircle,
  Clock,
  Truck,
  AlertTriangle,
  XCircle
} from "lucide-react";

import { orders } from "./sample"; 

// Status badge helper
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-4 h-4 mr-1" /> },
    processing: { color: "bg-blue-100 text-blue-800", icon: <RefreshCw className="w-4 h-4 mr-1" /> },
    shipped: { color: "bg-indigo-100 text-indigo-800", icon: <Truck className="w-4 h-4 mr-1" /> },
    delivered: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-4 h-4 mr-1" /> },
    cancelled: { color: "bg-red-100 text-red-800", icon: <XCircle className="w-4 h-4 mr-1" /> },
    returned: { color: "bg-orange-100 text-orange-800", icon: <AlertTriangle className="w-4 h-4 mr-1" /> }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`flex items-center px-2 py-1 rounded-full ${config.color}`}>
      {config.icon}
      <span className="capitalize">{status}</span>
    </div>
  );
};

// Order status update animation
const OrderStatusUpdate = ({ onClose }) => {
  const [stage, setStage] = useState(0);
  
  useState(() => {
    const timer = setTimeout(() => {
      setStage(1);
      setTimeout(() => {
        setStage(2);
        setTimeout(() => {
          onClose();
        }, 1000);
      }, 1000);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {stage === 0 && (
        <div className="flex flex-col items-center">
          <RefreshCw className="w-16 h-16 text-blue-500 animate-spin" />
          <p className="mt-4 text-lg">Updating order status...</p>
        </div>
      )}
      {stage === 1 && (
        <div className="flex flex-col items-center">
          <div className="relative">
            <RefreshCw className="w-16 h-16 text-blue-500" />
            <CheckCircle className="absolute -right-2 -bottom-2 w-8 h-8 text-green-500 animate-bounce" />
          </div>
          <p className="mt-4 text-lg">Status updated!</p>
        </div>
      )}
      {stage === 2 && (
        <div className="flex flex-col items-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <p className="mt-4 text-lg">Order successfully updated</p>
        </div>
      )}
    </div>
  );
};

export default function AdminOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [addressDialog, setAddressDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleStatusChange = (newStatus) => {
    setUpdatingStatus(true);
    // In a real app, you would make an API call here
    setTimeout(() => {
      setSelectedOrder(prev => ({...prev, status: newStatus}));
      setUpdatingStatus(false);
      setStatusDialog(false);
    }, 2800);
  };

  return (
    <>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Search and Filter Bar */}
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" /> 
                Orders Management
              </CardTitle>
              <CardDescription>Manage all customer orders from this dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
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
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <div>{order.customer}</div>
                            <div className="text-sm text-muted-foreground hidden sm:block">{order.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(order.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setAddressDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-2">Details</span>
                            </Button>
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
          
          {/* Order Details Dialog */}
          {selectedOrder && (
            <Dialog open={addressDialog} onOpenChange={setAddressDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" /> 
                    Order Details - {selectedOrder.id}
                  </DialogTitle>
                  <DialogDescription>
                    Full information about this order
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <div className="text-sm mt-1">{selectedOrder.customer}</div>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <div className="text-sm mt-1">{selectedOrder.email}</div>
                      </div>
                      <div>
                        <Label>Order Date</Label>
                        <div className="text-sm mt-1">
                          {new Date(selectedOrder.date).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label>Payment Method</Label>
                        <div className="text-sm mt-1">{selectedOrder.payment}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                    <div className="text-sm">
                      <p>{selectedOrder.address.line1}</p>
                      {selectedOrder.address.line2 && <p>{selectedOrder.address.line2}</p>}
                      <p>{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zip}</p>
                      <p>{selectedOrder.address.country}</p>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Order Items</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              ${(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex justify-end mt-4">
                      <div className="w-48">
                        <div className="flex justify-between py-1">
                          <span>Subtotal:</span>
                          <span>${selectedOrder.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Shipping:</span>
                          <span>$0.00</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Tax:</span>
                          <span>$0.00</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between py-1 font-medium">
                          <span>Total:</span>
                          <span>${selectedOrder.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-between w-full gap-2">
                    <div className="flex items-center">
                      <StatusBadge status={selectedOrder.status} />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setAddressDialog(false);
                          setStatusDialog(true);
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Update Status
                      </Button>
                      <DialogClose asChild>
                        <Button>Close</Button>
                      </DialogClose>
                    </div>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          
          {/* Status Update Dialog */}
          {selectedOrder && (
            <Dialog open={statusDialog} onOpenChange={setStatusDialog}>
              <DialogContent className="max-w-md">
                {updatingStatus ? (
                  <OrderStatusUpdate onClose={() => setUpdatingStatus(false)} />
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle>Update Order Status</DialogTitle>
                      <DialogDescription>
                        Change the status for order {selectedOrder.id}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                      <div className="mb-4">
                        <Label htmlFor="current-status">Current Status</Label>
                        <div className="mt-1">
                          <StatusBadge status={selectedOrder.status} />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <Label htmlFor="new-status">New Status</Label>
                        <Select defaultValue={selectedOrder.status} onValueChange={handleStatusChange}>
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select new status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="returned">Returned</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="status-note">Add a note (optional)</Label>
                        <Input 
                          id="status-note" 
                          className="mt-1" 
                          placeholder="Add a note about this status change"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setStatusDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setUpdatingStatus(true)}>
                        Update Status
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </>
  );
}