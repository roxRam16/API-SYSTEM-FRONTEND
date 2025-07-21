import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { productsAPI, customersAPI, suppliersAPI, salesAPI } from '../services/api';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  supplier: string;
  barcode: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  type: 'individual' | 'business';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'transfer';
  createdAt: Date;
  updatedAt: Date;
}

interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  contactPerson: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface DataContextType {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  
  // Products
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  searchProducts: (term: string) => Promise<Product[]>;
  
  // Customers
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  searchCustomers: (term: string) => Promise<Customer[]>;
  
  // Sales
  addSale: (sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSale: (id: string, sale: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  
  // Suppliers
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  searchSuppliers: (term: string) => Promise<Supplier[]>;
  
  // Refresh data
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [productsData, customersData, salesData, suppliersData] = await Promise.all([
        productsAPI.getAll().catch(() => []),
        customersAPI.getAll().catch(() => []),
        salesAPI.getAll().catch(() => []),
        suppliersAPI.getAll().catch(() => [])
      ]);

      setProducts(productsData);
      setCustomers(customersData);
      setSales(salesData);
      setSuppliers(suppliersData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar los datos. Usando datos locales.');
      
      // Fallback to local data
      setProducts([
        {
          id: '1',
          name: 'Laptop HP Pavilion',
          category: 'Electronics',
          price: 899.99,
          stock: 15,
          supplier: 'TechSupply Inc.',
          barcode: '1234567890123',
          description: 'High-performance laptop for business and gaming',
          status: 'active',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        }
      ]);
      
      setCustomers([
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1-555-0123',
          address: '123 Main St, City, State 12345',
          taxId: 'TAX123456',
          type: 'individual',
          status: 'active',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10')
        }
      ]);
      
      setSuppliers([
        {
          id: '1',
          name: 'TechSupply Inc.',
          email: 'orders@techsupply.com',
          phone: '+1-555-0125',
          address: '789 Industrial Blvd, City, State 12345',
          taxId: 'TAX345678',
          contactPerson: 'Sarah Johnson',
          status: 'active',
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-05')
        }
      ]);
      
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Products
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProduct = await productsAPI.create(productData);
      setProducts(prev => [...prev, newProduct]);
    } catch (err) {
      console.error('Error adding product:', err);
      throw new Error('Error al crear el producto');
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const updatedProduct = await productsAPI.update(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
    } catch (err) {
      console.error('Error updating product:', err);
      throw new Error('Error al actualizar el producto');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productsAPI.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw new Error('Error al eliminar el producto');
    }
  };

  const searchProducts = async (term: string): Promise<Product[]> => {
    try {
      return await productsAPI.search(term);
    } catch (err) {
      console.error('Error searching products:', err);
      return products.filter(p => 
        p.name.toLowerCase().includes(term.toLowerCase()) ||
        p.barcode.includes(term) ||
        p.category.toLowerCase().includes(term.toLowerCase())
      );
    }
  };

  // Customers
  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCustomer = await customersAPI.create(customerData);
      setCustomers(prev => [...prev, newCustomer]);
    } catch (err) {
      console.error('Error adding customer:', err);
      throw new Error('Error al crear el cliente');
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    try {
      const updatedCustomer = await customersAPI.update(id, customerData);
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
    } catch (err) {
      console.error('Error updating customer:', err);
      throw new Error('Error al actualizar el cliente');
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await customersAPI.delete(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting customer:', err);
      throw new Error('Error al eliminar el cliente');
    }
  };

  const searchCustomers = async (term: string): Promise<Customer[]> => {
    try {
      return await customersAPI.search(term);
    } catch (err) {
      console.error('Error searching customers:', err);
      return customers.filter(c => 
        c.name.toLowerCase().includes(term.toLowerCase()) ||
        c.email.toLowerCase().includes(term.toLowerCase()) ||
        c.phone.includes(term)
      );
    }
  };

  // Sales
  const addSale = async (saleData: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newSale = await salesAPI.create(saleData);
      setSales(prev => [...prev, newSale]);
    } catch (err) {
      console.error('Error adding sale:', err);
      throw new Error('Error al crear la venta');
    }
  };

  const updateSale = async (id: string, saleData: Partial<Sale>) => {
    try {
      const updatedSale = await salesAPI.update(id, saleData);
      setSales(prev => prev.map(s => s.id === id ? updatedSale : s));
    } catch (err) {
      console.error('Error updating sale:', err);
      throw new Error('Error al actualizar la venta');
    }
  };

  const deleteSale = async (id: string) => {
    try {
      await salesAPI.delete(id);
      setSales(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting sale:', err);
      throw new Error('Error al eliminar la venta');
    }
  };

  // Suppliers
  const addSupplier = async (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newSupplier = await suppliersAPI.create(supplierData);
      setSuppliers(prev => [...prev, newSupplier]);
    } catch (err) {
      console.error('Error adding supplier:', err);
      throw new Error('Error al crear el proveedor');
    }
  };

  const updateSupplier = async (id: string, supplierData: Partial<Supplier>) => {
    try {
      const updatedSupplier = await suppliersAPI.update(id, supplierData);
      setSuppliers(prev => prev.map(s => s.id === id ? updatedSupplier : s));
    } catch (err) {
      console.error('Error updating supplier:', err);
      throw new Error('Error al actualizar el proveedor');
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await suppliersAPI.delete(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting supplier:', err);
      throw new Error('Error al eliminar el proveedor');
    }
  };

  const searchSuppliers = async (term: string): Promise<Supplier[]> => {
    try {
      return await suppliersAPI.search(term);
    } catch (err) {
      console.error('Error searching suppliers:', err);
      return suppliers.filter(s => 
        s.name.toLowerCase().includes(term.toLowerCase()) ||
        s.email.toLowerCase().includes(term.toLowerCase()) ||
        s.phone.includes(term)
      );
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const value: DataContextType = {
    products,
    customers,
    sales,
    suppliers,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    addSale,
    updateSale,
    deleteSale,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers,
    refreshData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};