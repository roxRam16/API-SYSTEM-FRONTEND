import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Shield, Bell, Lock, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import FloatingLabelInput from './FloatingLabelInput';
import AISwitch from './AISwitch';
import AIButton from './AIButton';
import CancelConfirmModal from './CancelConfirmModal';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess } = useNotifications();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1-555-0123',
    address: '123 Business St, City, State 12345',
    bio: 'Experienced POS system administrator with expertise in retail operations and inventory management.'
  });

  const [originalProfileData, setOriginalProfileData] = useState(profileData);

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    salesAlerts: true,
    lowStockAlerts: true,
    reportReminders: false
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newData = {
      ...profileData,
      [e.target.name]: e.target.value
    };
    setProfileData(newData);
    setHasChanges(JSON.stringify(newData) !== JSON.stringify(originalProfileData));
  };

  const handleNotificationChange = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications]
    });
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecurity({
      ...security,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalProfileData(profileData);
  };

  const handleSave = () => {
    showSuccess('¡Perfil actualizado!', 'Los cambios en tu perfil se han guardado correctamente');
    setIsEditing(false);
    setHasChanges(false);
    setOriginalProfileData(profileData);
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
    setProfileData(originalProfileData);
    setHasChanges(false);
    setShowCancelModal(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  return (
    <div className="space-y-6 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración del Perfil</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Administra tu cuenta y preferencias</p>
        </div>
        
        {/* Save and Cancel Buttons - Top Position */}
        {isEditing && activeTab === 'profile' && (
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user?.role}</p>
              <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-full mt-2">
                <Shield className="w-3 h-3 mr-1" />
                Active
              </span>
            </div>

            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Información del Perfil</h2>
                  {!isEditing && (
                    <AIButton
                      onClick={handleEdit}
                      variant="primary"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <span>Editar</span>
                    </AIButton>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingLabelInput
                    id="name"
                    type="text"
                    label="Nombre Completo"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    icon={<User className="w-5 h-5" />}
                    placeholder="Tu nombre completo"
                  />

                  <FloatingLabelInput
                    id="email"
                    type="email"
                    label="Correo Electrónico"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    icon={<Mail className="w-5 h-5" />}
                    placeholder="tu@email.com"
                  />

                  <FloatingLabelInput
                    id="phone"
                    type="tel"
                    label="Número de Teléfono"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    icon={<Phone className="w-5 h-5" />}
                    placeholder="+1 (555) 123-4567"
                  />

                  <FloatingLabelInput
                    id="address"
                    type="text"
                    label="Dirección"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    icon={<MapPin className="w-5 h-5" />}
                    placeholder="Tu dirección"
                  />
                </div>

                <div>
                  <FloatingLabelInput
                    id="bio"
                    type="text"
                    label="Biografía"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    placeholder="Cuéntanos sobre ti..."
                    multiline
                    rows={4}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preferencias de Notificaciones</h2>
                
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {key === 'emailNotifications' && 'Recibir notificaciones por correo electrónico'}
                          {key === 'pushNotifications' && 'Recibir notificaciones push en el navegador'}
                          {key === 'salesAlerts' && 'Alertas sobre nuevas ventas'}
                          {key === 'lowStockAlerts' && 'Alertas cuando los productos tengan poco stock'}
                          {key === 'reportReminders' && 'Recordatorios de generación de reportes semanales'}
                        </p>
                      </div>
                      <AISwitch
                        checked={value}
                        onChange={() => handleNotificationChange(key)}
                        size="md"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <AIButton
                    onClick={() => showSuccess('¡Preferencias guardadas!', 'Tus preferencias de notificaciones se han actualizado')}
                    variant="save"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Guardar Preferencias</span>
                  </AIButton>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Configuración de Seguridad</h2>
                
                <div className="space-y-6">
                  <FloatingLabelInput
                    id="currentPassword"
                    type="password"
                    label="Contraseña Actual"
                    value={security.currentPassword}
                    onChange={handleSecurityChange}
                    icon={<Lock className="w-5 h-5" />}
                    placeholder="Tu contraseña actual"
                  />

                  <FloatingLabelInput
                    id="newPassword"
                    type="password"
                    label="Nueva Contraseña"
                    value={security.newPassword}
                    onChange={handleSecurityChange}
                    icon={<Lock className="w-5 h-5" />}
                    placeholder="Nueva contraseña"
                  />

                  <FloatingLabelInput
                    id="confirmPassword"
                    type="password"
                    label="Confirmar Nueva Contraseña"
                    value={security.confirmPassword}
                    onChange={handleSecurityChange}
                    icon={<Lock className="w-5 h-5" />}
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Requisitos de Contraseña</h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Al menos 8 caracteres de longitud</li>
                    <li>• Contiene letras mayúsculas y minúsculas</li>
                    <li>• Contiene al menos un número</li>
                    <li>• Contiene al menos un carácter especial</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <AIButton
                    onClick={() => showSuccess('¡Contraseña actualizada!', 'Tu contraseña se ha cambiado exitosamente')}
                    variant="save"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Actualizar Contraseña</span>
                  </AIButton>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

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

export default ProfilePage;