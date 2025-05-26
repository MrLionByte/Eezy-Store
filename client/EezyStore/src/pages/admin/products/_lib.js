import { useState, useEffect } from "react";
import { adminProductService } from "../../../services/apiService"; 
import { toast } from "@/hooks/use-toast";

const emptyProductForm = {
  name: "",
  price: "",
  category: "",
  stock: "",
  description: "",
  image: null,
  imagePreview: null,
};

export function useAdminProductsLogic() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(emptyProductForm);
  const [fetchFromBackend, setFetchFromBackend] = useState(true);

  useEffect(() => {
    if(fetchFromBackend){
    fetchProducts();
    setFetchFromBackend(false)
    }
  }, [fetchFromBackend]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await adminProductService.list();
      console.log(data);
      
      setProducts(data.results);
    } catch (error) {
        let errorData = ''
        if (error.response.data?.image) {
            errorData = error.response.data.image[0] || 'Check image type';
          }
      console.error("Failed to fetch products:", error);
      toast({
        title: "Error",
        description: `Failed to load products. Please try again.${errorData}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFormData = () => {
    setFormData(emptyProductForm)
  }

  const handleAddProduct = async () => {
    setIsLoading(true);
    try {
      const productData = new FormData();
  
      productData.append('name', formData.name);
      productData.append('price', formData.price);
      productData.append('description', formData.description);
      
      if (formData.image instanceof File) {
        productData.append('image', formData.image);
      }
  
      const newProduct = await adminProductService.create(productData);
  
      setProducts(prev => [...prev, newProduct]);
      setIsAddDialogOpen(false);
      setFormData(emptyProductForm);
  
      toast({
        title: "Success",
        description: "Product added successfully!",
      });
      setFetchFromBackend(true);
    } catch (error) {
      let errorData = 'Failed to add product. Please try again.';
  
      if (error.response?.data?.image) {
        errorData = error.response.data.image[0] || 'Check image type';
      }
  
      toast({
        title: "Error",
        description: `${errorData}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async () => {
    setIsLoading(true);
    try {
      const productData = new FormData();
  
      productData.append('name', formData.name);
      productData.append('price', formData.price);
      productData.append('description', formData.description);
  
      if (formData.image instanceof File) {
        productData.append('image', formData.image);
      }
  
      const updatedProduct = await adminProductService.edit(selectedProduct.id, productData);
  
      setProducts(prev => prev?.map(product => 
        product.id === selectedProduct.id ? updatedProduct : product
      ));
  
      setIsEditDialogOpen(false);
      setFormData(emptyProductForm);
  
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
  
      setFetchFromBackend(true);
    } catch (error) {
      let errorData = 'Failed to update product. Please try again.';
    
      if (error.response?.data?.image) {
        errorData = error.response.data.image[0] || 'Check image type';
      }
  
      toast({
        title: "Error",
        description: `${errorData}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setIsLoading(true);
      try {
        await adminProductService.softDelete(id);
  
        setProducts(prev => prev?.filter(product => product.id !== id));
        toast({
          title: "Success",
          description: "Product deleted successfully!",
        });
        setFetchFromBackend(true);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const openEditDialog = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description,
      image: null,
      imagePreview: product.image || "/api/placeholder/200/200",
    });
    setIsEditDialogOpen(true);
  };

  const openDetailsDialog = async (product) => {
    setIsLoading(true);
    try {
      const productDetails = await adminProductService.getById(product.id);
      setSelectedProduct(productDetails);
      setIsDetailsDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    selectedProduct,
    formData,
    handleClearFormData,
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
  };
}



export const handleFormChange = (formData, setFormData, e) => {
  const { name, value, type } = e.target;
  
  if (type === 'number') {
    setFormData({
      ...formData,
      [name]: value
    });
  } else {
    setFormData({
      ...formData,
      [name]: value
    });
  }
};

export function handleImageUpload(formData, setFormData, event) {
    const file = event.target.files[0]; 
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  }