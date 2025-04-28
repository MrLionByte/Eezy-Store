import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { handleImageUpload } from "../../pages/admin/products/_lib";

export function ProductImageUpload({ formData, setFormData }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="image">Product Image</Label>
      <div className="flex flex-col items-center gap-4">
        <img 
          src={formData.imagePreview} 
          alt="Product preview" 
          className="h-40 w-40 rounded-md object-cover border" 
        />
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(formData, setFormData, e)}
          className="max-w-sm"
        />
      </div>
    </div>
  );
}