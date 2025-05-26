import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { handleImageUpload } from "../../pages/admin/products/_lib";

export function ProductImageUpload({ formData, setFormData }) {
  const  imageBaseUrl = import.meta.env.VITE_IMAGE_URL;
  return (
    <div className="space-y-2">
      <Label htmlFor="image">Product Image</Label>
      <div className="flex flex-col items-center gap-4">
        <img 
          src={`${imageBaseUrl}${formData.imagePreview}`} 
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