import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, ShoppingCart, DollarSign, Calendar, User, X, MoreHorizontal, Download, Archive, Sparkles, ArrowLeft } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import { format } from 'date-fns';
import ConfirmModal from './ConfirmModal';
import CancelConfirmModal from './CancelConfirmModal';
import ModuleFooter from './ModuleFooter';
import AIButton from './AIButton';
import AISwitch from './AISwitch';
import FloatingLabelInput from './FloatingLabelInput';

const SalesPage: React.FC = () => {
  const { sales, updateSale, loading } = useData();
  const { showSuccess, showError } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    status: 'pending' as 'pending' | 'completed' | 'cancelled',
    paymentReference: '',
    notes: ''
  });

  const [originalFormData, setOriginalFormData] = useState(formData);

  // Check for changes
  useEffect(() => {
    const hasFormChanges = JSON.stringify(formData) !== JSON.stringify(originalFormData);
    setHasChanges(hasFormChanges && isEditing);
  }, [formData, originalFormData, isEditing]);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const completedSales = sales.filter(sale => sale.status === 'completed').length;
  const pendingSales = sales.filter(sale => sale.status === 'pending').length;

  const selectSale = (sale: any) => {
    setSelectedSale(sale);
    const saleFormData = {
      status: sale.status,
      paymentReference: sale.paymentReference || '',
      notes: sale.notes || ''
    };
    setFormData(saleFormData);
    setOriginalFormData(saleFormData);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalFormData(formData);
  };

  const handleSave = async () => {
    if (!selectedSale) return;

    try {
      await updateSale(selectedSale.id, formData);
      showSuccess('¡Venta actualizada!', `Los cambios en la venta se guardaron correctamente`);
      setIsEditing(false);
      setSelectedSale({ ...selectedSale, ...formData });
      setOriginalFormData(formData);
      setHasChanges(false);
    } catch (error) {
      showError('Error al guardar', 'No se pudo actualizar la venta. Inténtalo de nuevo');
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
    if (selectedSale) {
      const saleFormData = {
        status: selectedSale.status,
        paymentReference: selectedSale.paymentReference || '',
        notes: selectedSale.notes || ''
      };
      setFormData(saleFormData);
      setOriginalFormData(saleFormData);
    }
    setHasChanges(false);
    setShowCancelModal(false);
  };

  const handleArchive = async () => {
    if (selectedSale) {
      try {
        await updateSale(selectedSale.id, { status: 'cancelled', archivedAt: new Date() });
        showSuccess('Venta cancelada', `La venta se canceló correctamente`);
        setShowConfirmModal(false);
        setSelectedSale(null);
      } catch (error) {
        showError('Error al cancelar', 'No se pudo cancelar la venta');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value as 'pending' | 'completed' | 'cancelled'
    });
  };

  return (
    <div className="space-y-4 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Ventas</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Rastrea y administra tus transacciones de venta</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Save and Cancel Buttons - Top Position with AI Effect */}
          {isEditing && (
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
                  <span>Exportar ventas</span>
                </button>
                <button 
                  onClick={() => {
                    if (selectedSale) {
                      setShowConfirmModal(true);
                      setShowMoreActions(false);
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Archive className="w-4 h-4" />
                  <span>Cancelar venta</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos Totales</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/10">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ventas Completadas</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{completedSales}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ventas Pendientes</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{pendingSales}</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-500/10">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
          <div className="flex-1 max-w-md">
            <FloatingLabelInput
              id="search"
              type="text"
              label="Buscar ventas"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              placeholder="Buscar por cliente o ID de venta..."
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="completed">Completada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Lista de Ventas</h2>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID Venta
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSales.map((sale, index) => (
                  <motion.tr
                    key={sale.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => selectSale(sale)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{sale.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{sale.customerName}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ${sale.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        sale.status === 'completed' 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                          : sale.status === 'pending'
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                          : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectSale(sale);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSales.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No se encontraron ventas</h3>
              <p className="text-gray-600 dark:text-gray-400">Intenta ajustar tus criterios de búsqueda o filtro</p>
            </div>
          )}
        </div>

        {/* Sale Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedSale ? 'Detalles de la Venta' : 'Selecciona una Venta'}
            </h2>
            
            {selectedSale && !isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleEdit}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Editar venta"
              >
                <Edit className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          {selectedSale ? (
            <div className="space-y-6">
              {selectedSale.status === 'cancelled' && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                    <Archive className="w-5 h-5" />
                    <span className="font-medium">Venta Cancelada</span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                    Esta venta fue cancelada el {selectedSale.archivedAt ? new Date(selectedSale.archivedAt).toLocaleDateString() : 'fecha no disponible'}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Cliente</label>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedSale.customerName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Fecha</label>
                  <p className="font-medium text-gray-900 dark:text-white">{format(new Date(selectedSale.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Método de Pago</label>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">{selectedSale.paymentMethod}</p>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado de la Venta
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={!isEditing || selectedSale.status === 'cancelled'}
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${(!isEditing || selectedSale.status === 'cancelled') ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>

                <FloatingLabelInput
                  id="paymentReference"
                  type="text"
                  label="Referencia de Pago"
                  value={formData.paymentReference}
                  onChange={handleChange}
                  disabled={!isEditing || selectedSale.status === 'cancelled'}
                  placeholder="Número de referencia o transacción"
                />

                <FloatingLabelInput
                  id="notes"
                  type="text"
                  label="Notas"
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={!isEditing || selectedSale.status === 'cancelled'}
                  placeholder="Notas adicionales sobre la venta"
                  multiline
                  rows={3}
                />
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Artículos</h3>
                <div className="space-y-3">
                  {selectedSale.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.productName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Cant: {item.quantity} × ${item.price}</p>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">${item.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="text-gray-900 dark:text-white">${selectedSale.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">IVA:</span>
                    <span className="text-gray-900 dark:text-white">${selectedSale.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-gray-900 dark:text-white">${selectedSale.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Selecciona una venta</h3>
              <p className="text-gray-600 dark:text-gray-400">Haz clic en una venta de la lista para ver sus detalles</p>
            </div>
          )}
        </div>
      </div>

      {/* Module Footer */}
      <ModuleFooter currentModule="sales" />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleArchive}
        title="Cancelar Venta"
        message="¿Estás seguro de que quieres cancelar esta venta? Esta acción no se puede deshacer."
        type="archive"
        itemName={selectedSale?.id}
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

export default SalesPage;