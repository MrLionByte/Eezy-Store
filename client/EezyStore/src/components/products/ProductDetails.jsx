import React from "react";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function ProductDetails({ product, onClose }) {
  if (!product) return null;
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>{product.name}</DialogTitle>
        <DialogDescription>
          Product details and customer reviews.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <img 
              src={product.image || product.imagePreview} 
              alt={product.name} 
              className="rounded-md w-full h-auto"
            />
          </div>
          <div className="md:col-span-2 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
              <p>{product.category}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Price</h4>
              <p>${parseFloat(product.price).toFixed(2)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Stock</h4>
              <p>{product.stock} units</p>
            </div>
            {product.rating && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Rating</h4>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < Math.round(product.rating) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300"
                      } 
                    />
                  ))}
                  <span className="ml-2">{product.rating.toFixed(1)}</span>
                </div>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
              <p className="text-sm">{product.description}</p>
            </div>
          </div>
        </div>

        {product.reviews && product.reviews.length > 0 && (
          <div className="pt-4 mt-4 border-t">
            <h3 className="font-medium mb-2">Customer Reviews</h3>
            <div className="space-y-3">
              {product.reviews.map(review => (
                <div key={review.id} className="p-3 bg-muted rounded-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{review.user}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className={i < Math.round(review.rating) 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-300"
                          } 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </DialogFooter>
    </>
  );
}