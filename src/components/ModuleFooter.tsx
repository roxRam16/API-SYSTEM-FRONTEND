import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Users, Truck, ShoppingCart, BarChart3, ArrowRight } from 'lucide-react';

interface ModuleFooterProps {
  currentModule: string;
}

const ModuleFooter: React.FC<ModuleFooterProps> = ({ currentModule }) => {
  const getRelatedModules = (current: string) => {
    switch (current) {
      case 'products':
        return [
          { path: '/suppliers', icon: Truck, label: 'Proveedores', description: 'Gestiona tus proveedores' },
          { path: '/customers', icon: Users, label: 'Clientes', description: 'Base de datos de clientes' },
          { path: '/new-sale', icon: ShoppingCart, label: 'Nueva Venta', description: 'Crear transacción' },
          { path: '/reports', icon: BarChart3, label: 'Reportes', description: 'Análisis de inventario' }
        ];
      case 'customers':
        return [
          { path: '/products', icon: Package, label: 'Productos', description: 'Catálogo de productos' },
          { path: '/new-sale', icon: ShoppingCart, label: 'Nueva Venta', description: 'Crear transacción' },
          { path: '/reports', icon: BarChart3, label: 'Reportes', description: 'Análisis de ventas' },
          { path: '/suppliers', icon: Truck, label: 'Proveedores', description: 'Red de proveedores' }
        ];
      case 'suppliers':
        return [
          { path: '/products', icon: Package, label: 'Productos', description: 'Inventario disponible' },
          { path: '/customers', icon: Users, label: 'Clientes', description: 'Base de datos de clientes' },
          { path: '/reports', icon: BarChart3, label: 'Reportes', description: 'Análisis de compras' },
          { path: '/new-sale', icon: ShoppingCart, label: 'Nueva Venta', description: 'Procesar venta' }
        ];
      default:
        return [
          { path: '/products', icon: Package, label: 'Productos', description: 'Gestión de inventario' },
          { path: '/customers', icon: Users, label: 'Clientes', description: 'Base de datos de clientes' },
          { path: '/suppliers', icon: Truck, label: 'Proveedores', description: 'Red de proveedores' },
          { path: '/reports', icon: BarChart3, label: 'Reportes', description: 'Análisis y métricas' }
        ];
    }
  };

  const relatedModules = getRelatedModules(currentModule);

  return (
    <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          También te podría interesar
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Explora otros módulos relacionados para optimizar tu flujo de trabajo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedModules.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={module.path}
                className="group block p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {module.label}
                      </h4>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {module.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <motion.div
          className="inline-flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Navegación inteligente powered by AI</span>
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModuleFooter;