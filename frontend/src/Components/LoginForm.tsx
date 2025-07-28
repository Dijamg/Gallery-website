import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { FormData } from '../types/auth';
import { useAuth } from '../hooks/useAuth';

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (username: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [credentials, setCredentials] = useState<FormData>({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setToken, setIsAdmin } = useContext(AuthContext);
  const { login } = useAuth();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(credentials);
      if (response.data.token) {
        setToken(response.data.token);
        setIsAdmin(response.data.isAdmin);
        setCredentials({ username: '', password: '' });
        onLoginSuccess?.(response.data.username);
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-600 z-50 p-4">
      <h3 className="text-white font-semibold mb-4">Login</h3>
      
      {error && (
        <div className="mb-3 p-2 bg-red-600 text-white text-sm rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Username</label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            placeholder="Enter username"
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            placeholder="Enter password"
            required
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm; 