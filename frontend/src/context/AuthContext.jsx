import { createContext, useContext, useState } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    toast.success(`Welcome back, ${data.name}!`);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    toast.success('Account created successfully!');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out');
  };

  const updateUser = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
