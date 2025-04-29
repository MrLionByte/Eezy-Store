// pages/admin/products/index.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Plus, Star, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import { ProductForm } from "../../../components/products/ProductForm";
import { ProductDetails } from "../../../components/products/ProductDetails";
import { useAdminProductsLogic } from "./_lib";

export default function AdminProductsPage() {

  const {
    products,
    selectedProduct,
    formData,
    setFormData,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    isLoading,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    openEditDialog,
    openDetailsDialog,
  } = useAdminProductsLogic();

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage your product catalog</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus size={16} /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new product to your catalog.
                  </DialogDescription>
                </DialogHeader>
                <ProductForm formData={formData} setFormData={setFormData} />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProduct} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" /> Adding...
                      </>
                    ) : (
                      "Add Product"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && products?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex justify-center items-center">
                          <Loader2 size={24} className="animate-spin mr-2" />
                          Loading products...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : products?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products?.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img 
                            src={product.image || "/api/placeholder/200/200"} 
                            alt={product.name} 
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">${parseFloat(product.price).toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="ml-1">{product.average_rating ? parseFloat(product.average_rating).toFixed(1) : "N/A"}/{product?.rating_count}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openDetailsDialog(product)}>
                                <Eye size={14} className="mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(product)}>
                                <Pencil size={14} className="mr-2" /> Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive" 
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 size={14} className="mr-2" /> Delete Product
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details and click save to apply changes.
            </DialogDescription>
          </DialogHeader>
          <ProductForm formData={formData} setFormData={setFormData} isEdit={true} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleEditProduct} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 size={24} className="animate-spin mr-2" />
              Loading product details...
            </div>
          ) : (
            <ProductDetails 
              product={selectedProduct} 
              onClose={() => setIsDetailsDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}