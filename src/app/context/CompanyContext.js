import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

// Contexto para gerenciar a empresa
const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState('Sanegrande');

  useEffect(() => {
    const storedCompany = localStorage.getItem('company');
    if (storedCompany) {
      setCompany(JSON.parse(storedCompany));
    }
  }, []);

  const setSelectedCompany = (companyData) => {
    // Armazenar os dados da empresa no localStorage
    localStorage.setItem('company', JSON.stringify(companyData));
    setCompany(companyData);
  };

  const clearCompany = () => {
    // Limpar dados da empresa
    localStorage.removeItem('company');
    setCompany(null);
  };

  return (
    <CompanyContext.Provider value={{ company, setSelectedCompany, clearCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

// Hook para acessar o contexto da empresa
export const useCompany = () => {
  return useContext(CompanyContext);
};
