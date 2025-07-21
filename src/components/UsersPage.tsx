import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Shield, Settings, Mail, Calendar, Plus, Edit, MoreHorizontal, Download, Archive, Sparkles, ArrowLeft } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import ModuleFooter from './ModuleFooter';
import AIButton from './AIButton';
import AISwitch from './AISwitch';
import FloatingLabelInput from './FloatingLabelInput';
import ConfirmModal from './ConfirmModal';
import CancelConfirmModal from './CancelConfirmModal';

const UsersPage: React.FC = () => {
  const { showSuccess, showError, showInfo } = useNotifications();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Administrator',
      email: 'admin@aipos.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-01-20 14:30',
      permissions: ['read', 'write', 'delete', 'admin'],
      isActive: true
    },
    {
      id: '2',
      name: 'Sales Manager',
      email: 'sales@aipos.com',
      role: 'Manager',
      status: 'Active',
      lastLogin: '2024-01-20 12:15',
      permissions: ['read', 'write'],
      isActive: true
    },
    {
      id: '3',
      name: 'Cashier',
      email: 'cashier@aipos.com',
      role: 'Cashier',
      status: 'Active',
      lastLogin: '2024-01-20 09:45',
      permissions: ['read'],
      isActive: true
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Cashier',
    isActive: true,
    permissions: ['read']
  });

  const [originalFormData, setOriginalFormData] = useState(formData);

  const selectUser = (user: any) => {
    setSelectedUser(user);
    const userFormData = {
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      permissions: user.permissions
    };
    setFormData(userFormData);
    setOriginalFormData(userFormData);
    setIsEditing(false);
    setIsCreating(false);
    setHasChanges(false);
  };

  const clearForm = () => {
    const emptyForm = {
      name: '',
      email: '',
      role: 'Cashier',
      isActive: true,
      permissions: ['read']
    };
    setFormData(emptyForm);
    setOriginalFormData(emptyForm);
    setSelectedUser(null);
    setIsEditing(false);
    setIsCreating(false);
    setHasChanges(false);
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

  const handleSave = () => {
    if (!formData.name.trim()) {
      showError('Error de validación', 'El nombre del usuario es obligatorio');
      return;
    }
    if (!formData.email.trim()) {
      showError('Error de validación', 'El correo electrónico es obligatorio');
      return;
    }

    try {
      if (isCreating) {
        const newUser = {
          id: Date.now().toString(),
          ...formData,
          status: formData.isActive ? 'Active' : 'Inactive',
          lastLogin: 'Never'
        };
        setUsers([...users, newUser]);
        showSuccess('¡Usuario creado!', `${formData.name} se agregó exitosamente al sistema`);
        clearForm();
      } else if (isEditing && selectedUser) {
        const updatedUsers = users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...formData, status: formData.isActive ? 'Active' : 'Inactive' }
            : user
        );
        setUsers(updatedUsers);
        showSuccess('¡Usuario actualizado!', `Los cambios en ${formData.name} se guardaron correctamente`);
        setIsEditing(false);
        setIsCreating(false);
        setSelectedUser({ ...selectedUser, ...formData });
        setOriginalFormData(formData);
        setHasChanges(false);
      }
    } catch (error) {
      showError('Error al guardar', 'No se pudo guardar el usuario. Inténtalo de nuevo');
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
    if (selectedUser) {
      const userFormData = {
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        isActive: selectedUser.isActive,
        permissions: selectedUser.permissions
      };
      setFormData(userFormData);
      setOriginalFormData(userFormData);
    } else {
      clearForm();
    }
    setHasChanges(false);
    setShowCancelModal(false);
  };

  const handleArchive = () => {
    if (selectedUser) {
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, isActive: false, status: 'Inactive', archivedAt: new Date() }
          : user
      );
      setUsers(updatedUsers);
      showSuccess('Usuario archivado', `${selectedUser.name} se archivó correctamente`);
      setShowConfirmModal(false);
      clearForm();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newData);
    setHasChanges(JSON.stringify(newData) !== JSON.stringify(originalFormData));
  };

  const handleActiveChange = (checked: boolean) => {
    const newData = {
      ...formData,
      isActive: checked
    };
    setFormData(newData);
    setHasChanges(JSON.stringify(newData) !== JSON.stringify(originalFormData));
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    let newPermissions = [...formData.permissions];
    if (checked) {
      if (!newPermissions.includes(permission)) {
        newPermissions.push(permission);
      }
    } else {
      newPermissions = newPermissions.filter(p => p !== permission);
    }
    
    const newData = {
      ...formData,
      permissions: newPermissions
    };
    setFormData(newData);
    setHasChanges(JSON.stringify(newData) !== JSON.stringify(originalFormData));
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200';
      case 'manager':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200';
      case 'cashier':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200';
    }
  };

  const isFormMode = isEditing || isCreating;

  return (
    <div className="space-y-4 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Administra usuarios del sistema y permisos</p>
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
            <span>Nuevo Usuario</span>
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
                  <span>Exportar usuarios</span>
                </button>
                <button 
                  onClick={() => {
                    if (selectedUser) {
                      setShowConfirmModal(true);
                      setShowMoreActions(false);
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Archive className="w-4 h-4" />
                  <span>Archivar usuario</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Grid and Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Lista de Usuarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => selectUser(user)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                    selectedUser?.id === user.id
                      ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Último acceso: {user.lastLogin}</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <Shield className="w-4 h-4 mr-2" />
                        <span>Permisos:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map(permission => (
                          <span
                            key={permission}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'Active' 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                          : 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200'
                      }`}>
                        {user.status}
                      </span>
                      {selectedUser?.id === user.id && !isFormMode && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit();
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* User Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isCreating ? 'Nuevo Usuario' : selectedUser ? 'Detalles del Usuario' : 'Selecciona un Usuario'}
            </h2>
            
            {selectedUser && !isFormMode && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleEdit}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Editar usuario"
              >
                <Edit className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          {(selectedUser || isCreating) ? (
            <div className="space-y-6">
              {selectedUser?.status === 'Inactive' && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                    <Archive className="w-5 h-5" />
                    <span className="font-medium">Usuario Archivado</span>
                  </div>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                    Este usuario fue archivado el {selectedUser.archivedAt ? new Date(selectedUser.archivedAt).toLocaleDateString() : 'fecha no disponible'}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <FloatingLabelInput
                  id="name"
                  type="text"
                  label="Nombre Completo"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isFormMode || selectedUser?.status === 'Inactive'}
                  icon={<UserCheck className="w-5 h-5" />}
                  placeholder="Nombre del usuario"
                  required
                />

                <FloatingLabelInput
                  id="email"
                  type="email"
                  label="Correo Electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isFormMode || selectedUser?.status === 'Inactive'}
                  icon={<Mail className="w-5 h-5" />}
                  placeholder="correo@ejemplo.com"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rol del Usuario
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={!isFormMode || selectedUser?.status === 'Inactive'}
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${(!isFormMode || selectedUser?.status === 'Inactive') ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
                  >
                    <option value="Cashier">Cajero</option>
                    <option value="Manager">Gerente</option>
                    <option value="Admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Permisos
                  </label>
                  <div className="space-y-3">
                    {['read', 'write', 'delete', 'admin'].map(permission => (
                      <div key={permission} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {permission === 'read' && 'Lectura'}
                          {permission === 'write' && 'Escritura'}
                          {permission === 'delete' && 'Eliminación'}
                          {permission === 'admin' && 'Administración'}
                        </span>
                        <AISwitch
                          checked={formData.permissions.includes(permission)}
                          onChange={(checked) => handlePermissionChange(permission, checked)}
                          disabled={!isFormMode || selectedUser?.status === 'Inactive'}
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <AISwitch
                    checked={formData.isActive}
                    onChange={handleActiveChange}
                    label="Usuario Activo"
                    disabled={!isFormMode || selectedUser?.status === 'Inactive'}
                    size="md"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {formData.isActive ? 'Usuario activo en el sistema' : 'Usuario inactivo'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Selecciona un usuario</h3>
              <p className="text-gray-600 dark:text-gray-400">Haz clic en un usuario de la lista para ver sus detalles</p>
            </div>
          )}
        </div>
      </div>

      {/* Permissions Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Matriz de Permisos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lectura
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Escritura
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Eliminación
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Administración
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Administrador
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="w-4 h-4 bg-green-500 rounded-full inline-block"></span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="w-4 h-4 bg-green-500 rounded-full inline-block"></span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="w-4 h-4 bg-green-500 rounded-full inline-block"></span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="w-4 h-4 bg-green-500 rounded-full inline-block"></span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Gerente
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="w-4 h-4 bg-green-500 rounded-full inline-block"></span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="w-4 h-4 bg-green-500 rounded-full inline-block"></span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full inline-block"></span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full inline-block"></span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Cajero
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="w-4 h-4 bg-green-500 rounded-full inline-block"></span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full inline-block"></span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full inline-block"></span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full inline-block"></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Module Footer */}
      <ModuleFooter currentModule="users" />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleArchive}
        title="Archivar Usuario"
        message="¿Estás seguro de que quieres archivar este usuario? Podrás verlo después en modo de solo lectura."
        type="archive"
        itemName={selectedUser?.name}
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

export default UsersPage;