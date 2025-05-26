import { Package, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";

export default function OrderDetailsDialog({ selectedOrder, addressDialog, setAddressDialog, setStatusDialog }) {
  return (
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
          <div>
            <h3 className="text-lg font-medium mb-2">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <div className="text-sm mt-1">{selectedOrder.user?.first_name || selectedOrder?.user?.username}</div>
              </div>
              <div>
                <Label>Email</Label>
                <div className="text-sm mt-1">{selectedOrder?.user?.email}</div>
              </div>
              <div>
                <Label>Phone</Label>
                <div className="text-sm mt-1">{selectedOrder?.user?.phone}</div>
              </div>
              <div>
                <Label>Order Date</Label>
                <div className="text-sm mt-1">
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </div>
              </div>
              <div>
                <Label>Payment Method</Label>
                <div className="text-sm mt-1">C O D</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
            <div className="text-sm">
              <p>{selectedOrder.address.name}</p>
              {selectedOrder.address.street && <p>{selectedOrder.address.street}</p>}
              <p>{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zip}</p>
              <p>{selectedOrder.address.country}</p>
            </div>
          </div>
          
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
                {selectedOrder?.items?.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell className="text-right">
                       
                        ${isNaN(Number(item?.price)) ? 'N/A' : Number(item?.price).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                       
                        ${isNaN(Number(item?.price)) || isNaN(Number(item?.quantity)) ? 'N/A' : (Number(item?.price) * item.quantity).toFixed(2)}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>

            </Table>
            <div className="flex justify-end mt-4">
              <div className="w-48">
                <div className="flex justify-between py-1">
                  <span>Subtotal:</span>
                  <span>${selectedOrder?.total_amount}</span>
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
                  <span>${selectedOrder?.total_amount}</span>
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
                {selectedOrder.status !== 'delivered' &&
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
              }
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}