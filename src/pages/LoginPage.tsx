import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Brain, Zap, Network } from 'lucide-react';
import FloatingLabel from '../components/FloatingLabel';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    // Prefill demo credentials for easy testing
    setEmail('admin@aipos.com');
    setPassword('admin123');
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-40 right-32 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2], 
            opacity: [0.4, 0.7, 0.4] 
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-32 left-40 w-40 h-40 bg-cyan-500/10 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.2, 0.5, 0.2] 
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* Neural Network Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">AI POS System</h1>
            <p className="text-blue-200">Intelligent Point of Sale Solution</p>
          </div>

          {/* Demo Credentials Info */}
          <div className="mb-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
            <p className="text-sm text-blue-200 text-center">
              Demo credentials are pre-filled for testing
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FloatingLabel
              id="email"
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Network className="w-5 h-5" />}
            />

            <div className="relative">
              <FloatingLabel
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Zap className="w-5 h-5" />}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <motion.div 
                className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 text-sm text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-blue-200">
              Powered by AI • Secure • Intelligent
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;