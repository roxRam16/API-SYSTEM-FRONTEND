import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, DollarSign, Hash, Tag, FileText, User, ToggleLeft, ToggleRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import FloatingLabel from './FloatingLabel';

interface ProductFormProps {
  product?: any;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useData();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    supplier: '',
    barcode: '',
    description: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        supplier: product.supplier,
        barcode: product.barcode,
        description: product.description,
        status: product.status
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      supplier: formData.supplier,
      barcode: formData.barcode,
      description: formData.description,
      status: formData.status
    };

    if (product) {
      updateProduct(product.id, productData);
    } else {
      addProduct(productData);
    }

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingLabel
                id="name"
                type="text"
                label="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
                icon={<Package className="w-5 h-5" />}
                className="md:col-span-2"
              />

              <FloatingLabel
                id="category"
                type="text"
                label="Category"
                value={formData.category}
                onChange={handleChange}
                required
                icon={<Tag className="w-5 h-5" />}
              />

              <FloatingLabel
                id="price"
                type="number"
                label="Price"
                value={formData.price}
                onChange={handleChange}
                required
                icon={<DollarSign className="w-5 h-5" />}
              />

              <FloatingLabel
                id="stock"
                type="number"
                label="Stock Quantity"
                value={formData.stock}
                onChange={handleChange}
                required
                icon={<Hash className="w-5 h-5" />}
              />

              <FloatingLabel
                id="supplier"
                type="text"
                label="Supplier"
                value={formData.supplier}
                onChange={handleChange}
                required
                icon={<User className="w-5 h-5" />}
              />

              <FloatingLabel
                id="barcode"
                type="text"
                label="Barcode"
                value={formData.barcode}
                onChange={handleChange}
                required
                icon={<Hash className="w-5 h-5" />}
                className="md:col-span-2"
              />
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Product description..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-xs text-gray-500">Enable or disable this product</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: formData.status === 'active' ? 'inactive' : 'active' })}
                  className={`relative inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    formData.status === 'active'
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {formData.status === 'active' ? (
                    <ToggleRight className="w-5 h-5 mr-2" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 mr-2" />
                  )}
                  {formData.status === 'active' ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {product ? 'Update Product' : 'Add Product'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductForm;