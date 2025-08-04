import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Plus, Edit, AlertCircle, MoreHorizontal, Download, Archive, Sparkles, ArrowLeft } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import ConfirmModal from './ConfirmModal';
import CancelConfirmModal from './CancelConfirmModal';
import ModuleFooter from './ModuleFooter';
import AIButton from './AIButton';
import AISwitch from './AISwitch';
import FloatingLabelInput from './FloatingLabelInput';

const ProductsPage: React.FC = () => {
  const { addProduct, updateProduct, searchProducts, loading } = useData();
  const { showSuccess, showError } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock_quantity: '',
    supplier: '',
    barcode: '',
    description: '',
    sku: '',
    brand: '',
    unit_price: '',
    cost_price: '',
    supplier_id: '',
    min_stock_level: '',
    max_stock_level: '',
    tax_rate: '',
    weight: '',
    is_active: 'active' as 'active' | 'inactive',
    dimensions: '',
    image_urls: [] as string[],
    tags: [] as string[]
  });

  const [originalFormData, setOriginalFormData] = useState(formData);

  // Check for changes
  useEffect(() => {
    const hasFormChanges = JSON.stringify(formData) !== JSON.stringify(originalFormData);
    setHasChanges(hasFormChanges && (isEditing || isCreating));
  }, [formData, originalFormData, isEditing, isCreating]);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      try {
        const results = await searchProducts(term);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectProduct = (product: any) => {
    setSelectedProduct(product);
    const productFormData = {
      name: product.name,
      category: product.category,
      price: product.unit_price.toString(),
      stock_quantity: product.stock_quantity,
      supplier: product.supplier,
      supplier_id: product.supplier_id || '',
      barcode: product.barcode,
      description: product.description,
      is_active: product.is_active,
      sku: product.sku || '',
      brand: product.brand || '',
      unit_price: product.unit_price.toString(),
      cost_price: product.cost_price.toString(),
      min_stock_level: product.min_stock_level.toString(),
      max_stock_level: product.max_stock_level.toString(),
      tax_rate: product.tax_rate.toString(),
      weight: product.weight.toString(),
      dimensions: product.dimensions || '',
      image_urls: product.image_urls || [],
      tags: product.tags || []
    };
    setFormData(productFormData);
    setOriginalFormData(productFormData);
    setIsEditing(false);
    setIsCreating(false);
    setHasChanges(false);
  };

  const clearForm = () => {
    const emptyForm = {
      name: '',
      category: '',
      price: '',
      supplier: '',
      supplier_id: '',
      barcode: '',
      description: '',
      is_active: 'active' as 'active' | 'inactive',
      sku: '',
      brand: '',
      unit_price: '',
      cost_price: '',
      stock_quantity: '',
      min_stock_level: '',
      max_stock_level: '',
      tax_rate: '',
      weight: '',
      dimensions: '',
      image_urls: [] as string[],
      tags: [] as string[]
    };
    setFormData(emptyForm);
    setOriginalFormData(emptyForm);
    setSelectedProduct(null);
    setIsEditing(false);
    setIsCreating(false);
    setHasChanges(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsCreating(false);
    setOriginalFormData(formData);
  };

  const handleCreate = () => {
    clearForm();
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showError('Error de validación', 'El nombre del producto es obligatorio');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showError('Error de validación', 'El precio debe ser mayor a 0');
      return;
    }
    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
      showError('Error de validación', 'El stock no puede ser negativo');
      return;
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      sku: formData.sku,
      brand: formData.brand,
      unit_price: parseFloat(formData.unit_price),           // conversión aquí
      cost_price: parseFloat(formData.cost_price),           // conversión aquí
      stock_quantity: parseInt(formData.stock_quantity),     // conversión aquí
      supplier_id: formData.supplier_id,
      supplier: formData.supplier,
      barcode: formData.barcode,
      description: formData.description,
      min_stock_level: parseInt(formData.min_stock_level),   // conversión aquí
      max_stock_level: parseInt(formData.max_stock_level),   // conversión aquí
      tax_rate: parseFloat(formData.tax_rate),               // conversión aquí
      weight: parseFloat(formData.weight),                   // conversión aquí
      is_active: formData.is_active,
      dimensions: formData.dimensions,
      image_urls: formData.image_urls,
      tags: formData.tags
    };

    try {
      if (isCreating) {
        await addProduct(productData);
        showSuccess('¡Producto guardado!', `${formData.name} se agregó exitosamente al inventario`);
        clearForm();
      } else if (isEditing && selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
        showSuccess('¡Cambios guardados!', `Los datos de ${formData.name} se actualizaron correctamente`);
        setIsEditing(false);
        setIsCreating(false);
        setSelectedProduct({ ...selectedProduct, ...productData });
        setOriginalFormData(formData);
        setHasChanges(false);
      }
    } catch (error) {
      showError('Error al guardar', 'No se pudo guardar el producto. Inténtalo de nuevo');
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelModal(true);
    } else {
      confirmCancel();
    }
  };

  const confirmCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    if (selectedProduct) {
      const productFormData = {
        name: selectedProduct.name,
        category: selectedProduct.category,
        price: selectedProduct.unit_price.toString(),         // price como string para input
        supplier: selectedProduct.supplier,
        supplier_id: selectedProduct.supplier_id || '',
        barcode: selectedProduct.barcode,
        description: selectedProduct.description,
        is_active: selectedProduct.is_active,                     // status adaptado a is_active
        sku: selectedProduct.sku || '',
        brand: selectedProduct.brand || '',
        unit_price: selectedProduct.unit_price,
        cost_price: selectedProduct.cost_price,
        stock_quantity: selectedProduct.stock_quantity,
        min_stock_level: selectedProduct.min_stock_level,
        max_stock_level: selectedProduct.max_stock_level,
        tax_rate: selectedProduct.tax_rate,
        weight: selectedProduct.weight,
        dimensions: selectedProduct.dimensions || '',
        image_urls: selectedProduct.image_urls || [],
        tags: selectedProduct.tags || []
      };
      setFormData(productFormData);
      setOriginalFormData(productFormData);
    } else {
      clearForm();
    }
    setHasChanges(false);
    setShowCancelModal(false);
  };

  const handleArchive = async () => {
    if (selectedProduct) {
      try {
        await updateProduct(selectedProduct.id, { is_active: 'inactive', updatedAt: new Date() });
        showSuccess('Producto archivado', `${selectedProduct.name} se archivó correctamente`);
        setShowConfirmModal(false);
        clearForm();
      } catch (error) {
        showError('Error al archivar', 'No se pudo archivar el producto');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_active: checked ? 'active' : 'inactive'
    });
  };

  const isFormMode = isEditing || isCreating;

  return (
    <div className="space-y-4 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Productos</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Administra tu inventario de productos</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Save and Cancel Buttons - Top Position with AI Effect */}
          {isFormMode && (
            <div className="flex items-center space-x-2">
              <AIButton
                onClick={handleSave}
                variant="save"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Guardar</span>
              </AIButton>
              
              <AIButton
                onClick={handleCancel}
                variant="cancel"
                size="sm"
                className="flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </AIButton>
            </div>
          )}
          
          <AIButton
            onClick={handleCreate}
            variant="primary"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo</span>
          </AIButton>
          
          <div className="relative">
            <AIButton
              onClick={() => setShowMoreActions(!showMoreActions)}
              variant="cancel"
              size="sm"
              className="flex items-center space-x-2"
            >
              <MoreHorizontal className="w-4 h-4" />
              <span>Más acciones</span>
            </AIButton>
            
            {showMoreActions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Exportar productos</span>
                </button>
                <button 
                  onClick={() => {
                    if (selectedProduct) {
                      setShowConfirmModal(true);
                      setShowMoreActions(false);
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Archive className="w-4 h-4" />
                  <span>Archivar producto</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Section - Full Width */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Buscar Producto</h2>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, código o categoría..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {searchTerm && searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
            {searchResults.map(product => (
              <button
                key={product.id}
                onClick={() => selectProduct(product)}
                className="text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{product.category} - ${product.price}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">Stock: {product.stock_quantity}</div>
              </button>
            ))}
          </div>
        )}

        {searchTerm && searchResults.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No se encontraron productos</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Buscando...</p>
          </div>
        )}
      </div>

      {/* Form Section - Full Width */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isCreating ? 'Nuevo Producto' : selectedProduct ? 'Detalles del Producto' : 'Selecciona un Producto'}
          </h2>
          
          {selectedProduct && !isFormMode && (
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleEdit}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Editar producto"
              >
                <Edit className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>

        {(selectedProduct || isCreating) ? (
          <div className="space-y-6">
            {selectedProduct?.status === 'inactive' && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                  <Archive className="w-5 h-5" />
                  <span className="font-medium">Producto Archivado</span>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                  Este producto fue archivado el {selectedProduct.archivedAt ? new Date(selectedProduct.archivedAt).toLocaleDateString() : 'fecha no disponible'}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FloatingLabelInput
                id="name"
                type="text"
                label="Nombre del Producto"
                value={formData.name}
                onChange={handleChange}
                disabled={!isFormMode || selectedProduct?.status === 'inactive'}
                icon={<Package className="w-5 h-5" />}
                placeholder="Ingresa el nombre del producto"
                required
              />

              <FloatingLabelInput
                id="category"
                type="text"
                label="Categoría"
                value={formData.category}
                onChange={handleChange}
                disabled={!isFormMode || selectedProduct?.status === 'inactive'}
                placeholder="Categoría del producto"
                required
              />

              <FloatingLabelInput
                id="price"
                type="number"
                label="Precio"
                value={formData.price}
                onChange={handleChange}
                disabled={!isFormMode || selectedProduct?.status === 'inactive'}
                placeholder="0.00"
                required
              />

              <FloatingLabelInput
                id="stock"
                type="number"
                label="Stock"
                value={formData.stock_quantity}
                onChange={handleChange}
                disabled={!isFormMode || selectedProduct?.status === 'inactive'}
                placeholder="Cantidad en stock"
                required
              />
              {selectedProduct && parseInt(formData.stock_quantity) < 10 && (
                <div className="flex items-center mt-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">Stock bajo</span>
                </div>
              )}

              <FloatingLabelInput
                id="supplier"
                type="text"
                label="Proveedor"
                value={formData.supplier}
                onChange={handleChange}
                disabled={!isFormMode || selectedProduct?.status === 'inactive'}
                placeholder="Nombre del proveedor"
                required
              />

              <FloatingLabelInput
                id="barcode"
                type="text"
                label="Código de Barras"
                value={formData.barcode}
                onChange={handleChange}
                disabled={!isFormMode || selectedProduct?.status === 'inactive'}
                placeholder="Código de barras"
                required
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FloatingLabelInput
                  id="description"
                  type="text"
                  label="Descripción"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={!isFormMode || selectedProduct?.status === 'inactive'}
                  placeholder="Descripción detallada del producto"
                  multiline
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <AISwitch
                    checked={formData.is_active === 'active'}
                    onChange={handleStatusChange}
                    label="Estado del Producto"
                    disabled={!isFormMode || selectedProduct?.status === 'inactive'}
                    size="md"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {formData.is_active === 'active' ? 'Producto activo y disponible' : 'Producto inactivo'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Busca o crea un producto</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Usa el buscador para encontrar un producto existente o haz clic en "Nuevo" para crear uno desde cero
            </p>
          </div>
        )}
      </div>

      {/* Module Footer */}
      <ModuleFooter currentModule="products" />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleArchive}
        title="Archivar Producto"
        message="¿Estás seguro de que quieres archivar este producto? Podrás verlo después en modo de solo lectura."
        type="archive"
        itemName={selectedProduct?.name}
      />

      <CancelConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancel}
        title="Cancelar Edición"
        message="¿Estás seguro de que quieres cancelar? Se perderán todos los cambios no guardados."
        hasChanges={hasChanges}
      />
    </div>
  );
};

export default ProductsPage;