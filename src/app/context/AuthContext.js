import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5000/api';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se o token e o userId estão armazenados no localStorage
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (token && userId && userRole) {
      fetchUserDetails(userId, token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserDetails = async (userId, token) => {
    try {
      const response = await fetch(`${API_URL}/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json();

      // Se o role do usuário for válido, armazena no localStorage
      if (data.role != null) {
        localStorage.setItem('userRole', data.role);
      }

      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user details:', error);
      logout(); // Se falhar, remove os dados do localStorage
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    const { access_token, user } = userData;

    // Armazenar o token e as informações do usuário no localStorage
    localStorage.setItem('token', access_token);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userRole', user.role);

    // Também armazenar nos cookies se necessário
    Cookies.set('token', access_token, { expires: 7 });

    fetchUserDetails(user.id, access_token);
  };

  const logout = () => {
    // Limpar estado e dados do localStorage
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');

    // Remover os cookies
    Cookies.remove('token');
    Cookies.remove('userRole');

    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
