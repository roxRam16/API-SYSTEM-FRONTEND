import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
  return config;
});

// Handle auth errors and log responses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(`❌ API Error:`, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.detail || error.message,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },
};

// Products API
export const productsAPI = {
  getAll: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/products?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get products API error:', error);
      throw error;
    }
  },
  getById: async (id: string) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get product by ID API error:', error);
      throw error;
    }
  },
  create: async (productData: any) => {
    try {
      console.log('Creating product with data:', productData);
      const response = await api.post('/products', productData);
      console.log('Product created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create product API error:', error);
      throw error;
    }
  },
  update: async (id: string, productData: any) => {
    try {
      console.log('Updating product:', id, productData);
      const response = await api.put(`/products/${id}`, productData);
      console.log('Product updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update product API error:', error);
      throw error;
    }
  },
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete product API error:', error);
      throw error;
    }
  },
  search: async (term: string) => {
    try {
      const response = await api.get(`/products/search?q=${encodeURIComponent(term)}`);
      return response.data;
    } catch (error) {
      console.error('Search products API error:', error);
      throw error;
    }
  },
};

// Customers API
export const customersAPI = {
  getAll: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/customers?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get customers API error:', error);
      throw error;
    }
  },
  getById: async (id: string) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get customer by ID API error:', error);
      throw error;
    }
  },
  create: async (customerData: any) => {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      console.error('Create customer API error:', error);
      throw error;
    }
  },
  update: async (id: string, customerData: any) => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      console.error('Update customer API error:', error);
      throw error;
    }
  },
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete customer API error:', error);
      throw error;
    }
  },
  search: async (term: string) => {
    try {
      const response = await api.get(`/customers/search?q=${encodeURIComponent(term)}`);
      return response.data;
    } catch (error) {
      console.error('Search customers API error:', error);
      throw error;
    }
  },
};

// Suppliers API
export const suppliersAPI = {
  getAll: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/suppliers?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get suppliers API error:', error);
      throw error;
    }
  },
  getById: async (id: string) => {
    try {
      const response = await api.get(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get supplier by ID API error:', error);
      throw error;
    }
  },
  create: async (supplierData: any) => {
    try {
      const response = await api.post('/suppliers', supplierData);
      return response.data;
    } catch (error) {
      console.error('Create supplier API error:', error);
      throw error;
    }
  },
  update: async (id: string, supplierData: any) => {
    try {
      const response = await api.put(`/suppliers/${id}`, supplierData);
      return response.data;
    } catch (error) {
      console.error('Update supplier API error:', error);
      throw error;
    }
  },
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete supplier API error:', error);
      throw error;
    }
  },
  search: async (term: string) => {
    try {
      const response = await api.get(`/suppliers/search?q=${encodeURIComponent(term)}`);
      return response.data;
    } catch (error) {
      console.error('Search suppliers API error:', error);
      throw error;
    }
  },
};

// Sales API
export const salesAPI = {
  getAll: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/sales?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get sales API error:', error);
      throw error;
    }
  },
  getById: async (id: string) => {
    try {
      const response = await api.get(`/sales/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get sale by ID API error:', error);
      throw error;
    }
  },
  create: async (saleData: any) => {
    try {
      const response = await api.post('/sales', saleData);
      return response.data;
    } catch (error) {
      console.error('Create sale API error:', error);
      throw error;
    }
  },
  update: async (id: string, saleData: any) => {
    try {
      const response = await api.put(`/sales/${id}`, saleData);
      return response.data;
    } catch (error) {
      console.error('Update sale API error:', error);
      throw error;
    }
  },
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/sales/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete sale API error:', error);
      throw error;
    }
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check API error:', error);
      throw error;
    }
  }
};

export default api;