import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Download, Calendar, Filter, Sparkles, MoreHorizontal, FileText, PieChart } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import ModuleFooter from './ModuleFooter';
import AIButton from './AIButton';
import FloatingLabelInput from './FloatingLabelInput';

const ReportsPage: React.FC = () => {
  const { sales, products, customers } = useData();
  const { showSuccess, showInfo } = useNotifications();
  const [dateRange, setDateRange] = useState('month');
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [selectedReport, setSelectedReport] = useState('overview');

  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case 'week':
        return { start: subDays(now, 7), end: now };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'quarter':
        return { start: subDays(now, 90), end: now };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const { start, end } = getDateRange();
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    return saleDate >= start && saleDate <= end;
  });

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = filteredSales.length;
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Sales by day
  const salesByDay = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const daySales = sales.filter(sale => 
      format(new Date(sale.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    return {
      name: format(date, 'EEE'),
      sales: daySales.length,
      revenue: daySales.reduce((sum, sale) => sum + sale.total, 0)
    };
  });

  // Top products
  const productSales = products.map(product => {
    const soldQuantity = filteredSales.reduce((sum, sale) => {
      const item = sale.items.find(item => item.productId === product.id);
      return sum + (item ? item.quantity : 0);
    }, 0);
    return {
      name: product.name,
      quantity: soldQuantity,
      revenue: soldQuantity * product.price
    };
  }).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

  // Payment methods
  const paymentMethods = [
    { name: 'Efectivo', value: filteredSales.filter(s => s.paymentMethod === 'cash').length, color: '#10b981' },
    { name: 'Tarjeta', value: filteredSales.filter(s => s.paymentMethod === 'card').length, color: '#3b82f6' },
    { name: 'Transferencia', value: filteredSales.filter(s => s.paymentMethod === 'transfer').length, color: '#8b5cf6' }
  ];

  const handleExportReport = () => {
    showSuccess('Reporte exportado', 'El reporte se ha descargado exitosamente');
  };

  const handleGenerateReport = () => {
    showInfo('Generando reporte', 'El reporte personalizado se está generando...');
  };

  const reportTypes = [
    { id: 'overview', label: 'Resumen General', icon: BarChart3 },
    { id: 'sales', label: 'Análisis de Ventas', icon: TrendingUp },
    { id: 'products', label: 'Reporte de Productos', icon: PieChart },
    { id: 'customers', label: 'Análisis de Clientes', icon: FileText }
  ];

  return (
    <div className="space-y-4 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reportes y Análisis</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Información completa del negocio y análisis inteligente</p>
        </div>
        <div className="flex items-center space-x-2">
          <AIButton
            onClick={handleGenerateReport}
            variant="primary"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generar Reporte</span>
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
                <button 
                  onClick={handleExportReport}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar a Excel</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Exportar a PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tipo de Reporte:</h2>
            <div className="flex items-center space-x-2">
              {reportTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedReport(type.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedReport === type.id
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="week">Últimos 7 días</option>
                <option value="month">Este mes</option>
                <option value="quarter">Últimos 3 meses</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">+12.5%</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-green-500/10">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Ventas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalSales}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">+8.2%</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Valor Promedio</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${averageOrderValue.toFixed(2)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">+5.7%</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Tendencia de Ventas (Últimos 7 días)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Métodos de Pago</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={paymentMethods}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Productos Más Vendidos</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productSales} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis dataKey="name" type="category" stroke="#6b7280" width={120} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="quantity" fill="url(#colorGradient)" radius={[0, 4, 4, 0]} />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Summary Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resumen de Ventas Recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Artículos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSales.slice(0, 10).map((sale, index) => (
                <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {format(new Date(sale.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {sale.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {sale.items.length} artículos
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                    {sale.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${sale.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Module Footer */}
      <ModuleFooter currentModule="reports" />
    </div>
  );
};

export default ReportsPage;