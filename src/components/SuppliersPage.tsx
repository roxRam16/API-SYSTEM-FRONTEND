import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Truck, Save, Plus, Edit, Mail, User, MoreHorizontal, Download, Archive } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import ConfirmModal from './ConfirmModal';
import ModuleFooter from './ModuleFooter';

const SuppliersPage: React.FC = () => {
  const { suppliers, addSupplier, updateSupplier } = useData();
  const { showSuccess, showError } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    contactPerson: '',
    status: 'active' as 'active' | 'inactive'
  });

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm)
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term && filteredSuppliers.length > 0) {
      setSelectedSupplier(filteredSuppliers[0]);
      setFormData({
        name: filteredSuppliers[0].name,
        email: filteredSuppliers[0].email,
        phone: filteredSuppliers[0].phone,
        address: filteredSuppliers[0].address,
        taxId: filteredSuppliers[0].taxId,
        contactPerson: filteredSuppliers[0].contactPerson,
        status: filteredSuppliers[0].status
      });
      setIsEditing(false);
      setIsCreating(false);
    } else if (!term) {
      setSelectedSupplier(null);
      clearForm();
    }
  };

  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      contactPerson: '',
      status: 'active'
    });
    setSelectedSupplier(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreate = () => {
    clearForm();
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      showError('Error de validación', 'El nombre de la empresa es obligatorio');
      return;
    }
    if (!formData.email.trim()) {
      showError('Error de validación', 'El correo electrónico es obligatorio');
      return;
    }
    if (!formData.contactPerson.trim()) {
      showError('Error de validación', 'La persona de contacto es obligatoria');
      return;
    }

    try {
      if (isCreating) {
        addSupplier(formData);
        showSuccess('¡Proveedor guardado!', `${formData.name} se registró exitosamente como proveedor`);
        clearForm();
      } else if (isEditing && selectedSupplier) {
        updateSupplier(selectedSupplier.id, formData);
        showSuccess('¡Cambios guardados!', `Los datos de ${formData.name} se actualizaron correctamente`);
        setIsEditing(false);
        setIsCreating(false);
        setSelectedSupplier({ ...selectedSupplier, ...formData });
      }
    } catch (error) {
      showError('Error al guardar', 'No se pudo guardar el proveedor. Inténtalo de nuevo');
    }
  };

  const handleArchive = () => {
    if (selectedSupplier) {
      try {
        updateSupplier(selectedSupplier.id, { status: 'inactive', archivedAt: new Date() });
        showSuccess('Proveedor archivado', `${selectedSupplier.name} se archivó correctamente`);
        setShowConfirmModal(false);
        clearForm();
      } catch (error) {
        showError('Error al archivar', 'No se pudo archivar el proveedor');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCancel = () => {
    if (isEditing || isCreating) {
      setIsEditing(false);
      setIsCreating(false);
      if (selectedSupplier) {
        setFormData({
          name: selectedSupplier.name,
          email: selectedSupplier.email,
          phone: selectedSupplier.phone,
          address: selectedSupplier.address,
          taxId: selectedSupplier.taxId,
          contactPerson: selectedSupplier.contactPerson,
          status: selectedSupplier.status
        });
      } else {
        clearForm();
      }
    }
  };

  const isFormMode = isEditing || isCreating;

  return (
    <div className="space-y-4 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Proveedores</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Administra tus relaciones con proveedores</p>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo</span>
          </motion.button>
          
          <div className="relative">
            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 15px rgba(107, 114, 128, 0.3)"
              }}
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center space-x-2"
            >
              <MoreHorizontal className="w-4 h-4" />
              <span>Más acciones</span>
            </motion.button>
            
            {showMoreActions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Exportar proveedores</span>
                </button>
                <button 
                  onClick={() => {
                    if (selectedSupplier) {
                      setShowConfirmModal(true);
                      setShowMoreActions(false);
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Archive className="w-4 h-4" />
                  <span>Archivar proveedor</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Section - Full Width */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Buscar Proveedor</h2>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {searchTerm && filteredSuppliers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
            {filteredSuppliers.map(supplier => (
              <button
                key={supplier.id}
                onClick={() => {
                  setSelectedSupplier(supplier);
                  setFormData({
                    name: supplier.name,
                    email: supplier.email,
                    phone: supplier.phone,
                    address: supplier.address,
                    taxId: supplier.taxId,
                    contactPerson: supplier.contactPerson,
                    status: supplier.status
                  });
                  setIsEditing(false);
                  setIsCreating(false);
                }}
                className="text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-white text-sm">{supplier.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  {supplier.email}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  {supplier.contactPerson}
                </div>
              </button>
            ))}
          </div>
        )}

        {searchTerm && filteredSuppliers.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Truck className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No se encontraron proveedores</p>
          </div>
        )}
      </div>

      {/* Form Section - Full Width */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isCreating ? 'Nuevo Proveedor' : selectedSupplier ? 'Detalles del Proveedor' : 'Selecciona un Proveedor'}
          </h2>
          
          {selectedSupplier && !isFormMode && (
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleEdit}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Editar proveedor"
              >
                <Edit className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>

        {(selectedSupplier || isCreating) ? (
          <div className="space-y-6">
            {selectedSupplier?.status === 'inactive' && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                  <Archive className="w-5 h-5" />
                  <span className="font-medium">Proveedor Archivado</span>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                  Este proveedor fue archivado el {selectedSupplier.archivedAt ? new Date(selectedSupplier.archivedAt).toLocaleDateString() : 'fecha no disponible'}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isFormMode || selectedSupplier?.status === 'inactive'}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${(!isFormMode || selectedSupplier?.status === 'inactive') ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
                  placeholder="Nombre de la empresa proveedora"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={!isFormMode || selectedSupplier?.status === 'inactive'}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${(!isFormMode || selectedSupplier?.status === 'inactive') ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isFormMode || selectedSupplier?.status === 'inactive'}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${(!isFormMode || selectedSupplier?.status === 'inactive') ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
                  placeholder="correo@empresa.com"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isFormMode || selectedSupplier?.status === 'inactive'}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${(!isFormMode || selectedSupplier?.status === 'inactive') ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Persona de Contacto
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  disabled={!isFormMode || selectedSupplier?.status === 'inactive'}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${(!isFormMode || selectedSupplier?.status === 'inactive') ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
                  placeholder="Nombre del contacto principal"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  RFC / Tax ID
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  disabled={!isFormMode || selectedSupplier?.status === 'inactive'}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${(!isFormMode || selectedSupplier?.status === 'inactive') ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
                  placeholder="RFC o Tax ID"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dirección Completa
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isFormMode || selectedSupplier?.status === 'inactive'}
                  rows={4}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${(!isFormMode || selectedSupplier?.status === 'inactive') ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
                  placeholder="Dirección completa del proveedor"
                />
              </div>

              {isFormMode && selectedSupplier?.status !== 'inactive' && (
                <div className="flex flex-col space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleCancel}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
                      background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Guardar Proveedor</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Truck className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Busca o crea un proveedor</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Usa el buscador para encontrar un proveedor existente o haz clic en "Nuevo" para registrar uno nuevo
            </p>
          </div>
        )}
      </div>

      {/* Module Footer */}
      <ModuleFooter currentModule="suppliers" />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleArchive}
        title="Archivar Proveedor"
        message="¿Estás seguro de que quieres archivar este proveedor? Podrás verlo después en modo de solo lectura."
        type="archive"
        itemName={selectedSupplier?.name}
      />
    </div>
  );
};

export default SuppliersPage;