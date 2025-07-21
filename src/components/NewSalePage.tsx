import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Search, ShoppingCart, X, User, CreditCard, Banknote, Smartphone, Sparkles } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import ModuleFooter from './ModuleFooter';
import AIButton from './AIButton';
import AISwitch from './AISwitch';
import FloatingLabelInput from './FloatingLabelInput';

const NewSalePage: React.FC = () => {
  const { products, customers, addSale, searchProducts, searchCustomers } = useData();
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [productSearch, setProductSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [productResults, setProductResults] = useState<any[]>([]);
  const [customerResults, setCustomerResults] = useState<any[]>([]);
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);
  const [showProductSelect, setShowProductSelect] = useState(false);

  const handleProductSearch = async (term: string) => {
    setProductSearch(term);
    if (term.trim()) {
      try {
        const results = await searchProducts(term);
        setProductResults(results.filter(p => p.status === 'active' && p.stock > 0));
        setShowProductSelect(true);
      } catch (error) {
        setProductResults([]);
      }
    } else {
      setProductResults([]);
      setShowProductSelect(false);
    }
  };

  const handleCustomerSearch = async (term: string) => {
    setCustomerSearch(term);
    if (term.trim()) {
      try {
        const results = await searchCustomers(term);
        setCustomerResults(results.filter(c => c.status === 'active'));
        setShowCustomerSelect(true);
      } catch (error) {
        setCustomerResults([]);
      }
    } else {
      setCustomerResults([]);
      setShowCustomerSelect(false);
    }
  };

  const selectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);
    setShowCustomerSelect(false);
    showInfo('Cliente seleccionado', `Venta para: ${customer.name}`);
  };

  const addToCart = (product: any) => {
    const existingItem = cartItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCartItems(cartItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        ));
        showInfo('Producto agregado', `Se agregó una unidad más de ${product.name}`);
      } else {
        showWarning('Stock insuficiente', `No hay más stock disponible de ${product.name}`);
      }
    } else {
      setCartItems([...cartItems, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        total: product.price,
        maxStock: product.stock
      }]);
      showSuccess('Producto agregado', `${product.name} se agregó al carrito`);
    }
    setProductSearch('');
    setShowProductSelect(false);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      const item = cartItems.find(item => item.productId === productId);
      setCartItems(cartItems.filter(item => item.productId !== productId));
      showInfo('Producto removido', `${item?.productName} se eliminó del carrito`);
    } else {
      setCartItems(cartItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
          : item
      ));
    }
  };

  const removeFromCart = (productId: string) => {
    const item = cartItems.find(item => item.productId === productId);
    setCartItems(cartItems.filter(item => item.productId !== productId));
    showInfo('Producto removido', `${item?.productName} se eliminó del carrito`);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCompleteSale = async () => {
    if (!selectedCustomer) {
      showError('Cliente requerido', 'Debes seleccionar un cliente para completar la venta');
      return;
    }
    
    if (cartItems.length === 0) {
      showError('Carrito vacío', 'Agrega productos al carrito antes de completar la venta');
      return;
    }

    const saleData = {
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      items: cartItems,
      subtotal,
      tax,
      total,
      status: 'completed' as const,
      paymentMethod
    };

    try {
      await addSale(saleData);
      
      // Reset form
      setSelectedCustomer(null);
      setCartItems([]);
      setPaymentMethod('cash');
      setProductSearch('');
      setCustomerSearch('');
      
      showSuccess('¡Venta completada!', `Venta por $${total.toFixed(2)} registrada exitosamente para ${selectedCustomer.name}`);
    } catch (error) {
      showError('Error en la venta', 'No se pudo completar la venta. Inténtalo de nuevo');
    }
  };

  const clearCart = () => {
    setCartItems([]);
    showInfo('Carrito limpiado', 'Se eliminaron todos los productos del carrito');
  };

  return (
    <div className="space-y-4 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva Venta</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Crea una nueva transacción de venta</p>
        </div>
        <div className="flex items-center space-x-2">
          {cartItems.length > 0 && (
            <AIButton
              onClick={clearCart}
              variant="cancel"
              size="sm"
              className="flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Limpiar carrito</span>
            </AIButton>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product and Customer Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Seleccionar Cliente</h2>
            <div className="relative">
              <FloatingLabelInput
                id="customerSearch"
                type="text"
                label="Buscar clientes"
                value={customerSearch}
                onChange={(e) => handleCustomerSearch(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                placeholder="Buscar por nombre, email o teléfono..."
              />
              
              {showCustomerSelect && customerResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl mt-1 max-h-48 overflow-y-auto z-10 shadow-lg">
                  {customerResults.map(customer => (
                    <button
                      key={customer.id}
                      onClick={() => selectCustomer(customer)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {selectedCustomer && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-200">{selectedCustomer.name}</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{selectedCustomer.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCustomer(null);
                      setCustomerSearch('');
                      showInfo('Cliente deseleccionado', 'Se ha removido la selección del cliente');
                    }}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Product Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Agregar Productos</h2>
            <div className="relative mb-4">
              <FloatingLabelInput
                id="productSearch"
                type="text"
                label="Buscar productos"
                value={productSearch}
                onChange={(e) => handleProductSearch(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                placeholder="Buscar por nombre, código o categoría..."
              />
            </div>

            {showProductSelect && productResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {productResults.map(product => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addToCart(product)}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">{product.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">${product.price}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Stock: {product.stock}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {showProductSelect && productResults.length === 0 && productSearch && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No se encontraron productos disponibles</p>
              </div>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Carrito de Compras</h2>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">El carrito está vacío</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Agrega productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white">{item.productName}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">${item.price} cada uno</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, Math.min(item.quantity + 1, item.maxStock))}
                      className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="w-6 h-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors ml-2"
                    >
                      <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">IVA (10%):</span>
                  <span className="text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 dark:text-white">Método de Pago</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setPaymentMethod('cash');
                      showInfo('Método seleccionado', 'Pago en efectivo');
                    }}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'cash'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Banknote className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Efectivo</span>
                  </button>
                  <button
                    onClick={() => {
                      setPaymentMethod('card');
                      showInfo('Método seleccionado', 'Pago con tarjeta');
                    }}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Tarjeta</span>
                  </button>
                  <button
                    onClick={() => {
                      setPaymentMethod('transfer');
                      showInfo('Método seleccionado', 'Transferencia bancaria');
                    }}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'transfer'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">Transferencia</span>
                  </button>
                </div>
              </div>

              <AIButton
                onClick={handleCompleteSale}
                variant="save"
                size="md"
                className="w-full flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Completar Venta</span>
              </AIButton>
            </div>
          )}
        </div>
      </div>

      {/* Module Footer */}
      <ModuleFooter currentModule="new-sale" />
    </div>
  );
};

export default NewSalePage;