import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardHome from '../components/DashboardHome';
import ProductsPage from '../components/ProductsPage';
import CustomersPage from '../components/CustomersPage';
import SalesPage from '../components/SalesPage';
import SuppliersPage from '../components/SuppliersPage';
import NewSalePage from '../components/NewSalePage';
import ReportsPage from '../components/ReportsPage';
import UsersPage from '../components/UsersPage';
import ProfilePage from '../components/ProfilePage';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 dark:bg-gray-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content area with proper margin for collapsed sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden ml-16">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/new-sale" element={<NewSalePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;