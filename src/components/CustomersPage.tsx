import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Save, Plus, Edit, Mail, Phone, MoreHorizontal, Download, Archive, Sparkles, ArrowLeft } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import ConfirmModal from './ConfirmModal';
import CancelConfirmModal from './CancelConfirmModal';
import ModuleFooter from './ModuleFooter';
import AIButton from './AIButton';
import AISwitch from './AISwitch';
import FloatingLabelInput from './FloatingLabelInput';

const CustomersPage: React.FC = () => {
  const { customers, addCustomer, updateCustomer, searchCustomers, loading } = useData();
  const { showSuccess, showError } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    type: 'individual' as 'individual' | 'business',
    status: 'active' as 'active' | 'inactive'
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
        const results = await searchCustomers(term);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    const customerFormData = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      taxId: customer.taxId,
      type: customer.type,
      status: customer.status
    };
    setFormData(customerFormData);
    setOriginalFormData(customerFormData);
    setIsEditing(false);
    setIsCreating(false);
    setHasChanges(false);
  };

  const clearForm = () => {
    const emptyForm = {
      name: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      type: 'individual' as 'individual' | 'business',
      status: 'active' as 'active' | 'inactive'
    };
    setFormData(emptyForm);
    setOriginalFormData(emptyForm);
    setSelectedCustomer(null);
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
      showError('Error de validación', 'El nombre del cliente es obligatorio');
      return;
    }
    if (!formData.email.trim()) {
      showError('Error de validación', 'El correo electrónico es obligatorio');
      return;
    }
    if (!formData.phone.trim()) {
      showError('Error de validación', 'El teléfono es obligatorio');
      return;
    }

    try {
      if (isCreating) {
        await addCustomer(formData);
        showSuccess('¡Cliente guardado!', `${formData.name} se registró exitosamente en la base de datos`);
        clearForm();
      } else if (isEditing && selectedCustomer) {
        await updateCustomer(selectedCustomer.id, formData);
        showSuccess('¡Cambios guardados!', `Los datos de ${formData.name} se actualizaron correctamente`);
        setIsEditing(false);
        setIsCreating(false);
        setSelectedCustomer({ ...selectedCustomer, ...formData });
        setOriginalFormData(formData);
        setHasChanges(false);
      }
    } catch (error) {
      showError('Error al guardar', 'No se pudo guardar el cliente. Inténtalo de nuevo');
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
    if (selectedCustomer) {
      const customerFormData = {
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
        address: selectedCustomer.address,
        taxId: selectedCustomer.taxId,
        type: selectedCustomer.type,
        status: selectedCustomer.status
      };
      setFormData(customerFormData);
      setOriginalFormData(customerFormData);
    } else {
      clearForm();
    }
    setHasChanges(false);
    setShowCancelModal(false);
  };

  const handleArchive = async () => {
    if (selectedCustomer) {
      try {
        await updateCustomer(selectedCustomer.id, { status: 'inactive', archivedAt: new Date() });
        showSuccess('Cliente archivado', `${selectedCustomer.name} se archivó correctamente`);
        setShowConfirmModal(false);
        clearForm();
      } catch (error) {
        showError('Error al archivar', 'No se pudo archivar el cliente');
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
      status: checked ? 'active' : 'inactive'
    });
  };

  const handleTypeChange = (checked: boolean) => {
    setFormData({
      ...formData,
      type: checked ? 'business' : 'individual'
    });
  };

  const isFormMode = isEditing || isCreating;

  return (
    <div className="space-y-4 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Clientes</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Administra tu base de datos de clientes</p>
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
                  <span>Exportar clientes</span>
                </button>
                <button 
                  onClick={() => {
                    if (selectedCustomer) {
                      setShowConfirmModal(true);
                      setShowMoreActions(false);
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Archive className="w-4 h-4" />
                  <span>Archivar cliente</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Section - Full Width */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Buscar Cliente</h2>
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

        {searchTerm && searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
            {searchResults.map(customer => (
              <button
                key={customer.id}
                onClick={() => selectCustomer(customer)}
                className="text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-white text-sm">{customer.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  {customer.email}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  {customer.phone}
                </div>
              </button>
            ))}
          </div>
        )}

        {searchTerm && searchResults.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No se encontraron clientes</p>
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
            {isCreating ? 'Nuevo Cliente' : selectedCustomer ? 'Detalles del Cliente' : 'Selecciona un Cliente'}
          </h2>
          
          {selectedCustomer && !isFormMode && (
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleEdit}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Editar cliente"
              >
                <Edit className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>

        {(selectedCustomer || isCreating) ? (
          <div className="space-y-6">
            {selectedCustomer?.status === 'inactive' && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                  <Archive className="w-5 h-5" />
                  <span className="font-medium">Cliente Archivado</span>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                  Este cliente fue archivado el {selectedCustomer.archivedAt ? new Date(selectedCustomer.archivedAt).toLocaleDateString() : 'fecha no disponible'}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FloatingLabelInput
                id="name"
                type="text"
                label="Nombre Completo"
                value={formData.name}
                onChange={handleChange}
                disabled={!isFormMode || selectedCustomer?.status === 'inactive'}
                icon={<Users className="w-5 h-5" />}
                placeholder="Ingresa el nombre completo"
                required
              />

              <FloatingLabelInput
                id="email"
                type="email"
                label="Correo Electrónico"
                value={formData.email}
                onChange={handleChange}
                disabled={!isFormMode || selectedCustomer?.status === 'inactive'}
                icon={<Mail className="w-5 h-5" />}
                placeholder="correo@ejemplo.com"
                required
              />

              <FloatingLabelInput
                id="phone"
                type="tel"
                label="Teléfono"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isFormMode || selectedCustomer?.status === 'inactive'}
                icon={<Phone className="w-5 h-5" />}
                placeholder="+1 (555) 123-4567"
                required
              />

              <FloatingLabelInput
                id="taxId"
                type="text"
                label="RFC / Tax ID"
                value={formData.taxId}
                onChange={handleChange}
                disabled={!isFormMode || selectedCustomer?.status === 'inactive'}
                placeholder="RFC o Tax ID"
                required
                className="lg:col-span-2"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FloatingLabelInput
                  id="address"
                  type="text"
                  label="Dirección Completa"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isFormMode || selectedCustomer?.status === 'inactive'}
                  placeholder="Dirección completa del cliente"
                  multiline
                  rows={4}
                />
              </div>

              <div className="space-y-6">
                <div>
                  <AISwitch
                    checked={formData.type === 'business'}
                    onChange={handleTypeChange}
                    label="Tipo de Cliente"
                    disabled={!isFormMode || selectedCustomer?.status === 'inactive'}
                    size="md"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {formData.type === 'business' ? 'Cliente empresarial' : 'Cliente individual'}
                  </p>
                </div>

                <div>
                  <AISwitch
                    checked={formData.status === 'active'}
                    onChange={handleStatusChange}
                    label="Estado del Cliente"
                    disabled={!isFormMode || selectedCustomer?.status === 'inactive'}
                    size="md"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {formData.status === 'active' ? 'Cliente activo' : 'Cliente inactivo'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Busca o crea un cliente</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Usa el buscador para encontrar un cliente existente o haz clic en "Nuevo" para registrar uno nuevo
            </p>
          </div>
        )}
      </div>

      {/* Module Footer */}
      <ModuleFooter currentModule="customers" />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleArchive}
        title="Archivar Cliente"
        message="¿Estás seguro de que quieres archivar este cliente? Podrás verlo después en modo de solo lectura."
        type="archive"
        itemName={selectedCustomer?.name}
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

export default CustomersPage;