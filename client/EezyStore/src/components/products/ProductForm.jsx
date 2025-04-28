import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductImageUpload } from "./ProductImageUpload";
import { handleFormChange } from "../../pages/admin/products/_lib";

export function ProductForm({ formData, setFormData, isEdit = false }) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input 
            id="name" 
            name="name"
            value={formData.name}
            onChange={(e) => handleFormChange(formData, setFormData, e)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input 
            id="price" 
            name="price"
            type="number" 
            step="0.01"
            value={formData.price}
            onChange={(e) => handleFormChange(formData, setFormData, e)}
          />
        </div>
      </div>
      
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description"
          rows={3}
          value={formData.description}
          onChange={(e) => handleFormChange(formData, setFormData, e)}
        />
      </div>
      
      <ProductImageUpload formData={formData} setFormData={setFormData} />
    </div>
  );
}