const API_URL = 'http://localhost:3001/api';

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/product`);
    if (!response.ok) {
      throw new Error('Erro ao buscar produtos');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/user`);
    if (!response.ok) {
      throw new Error('Erro ao buscar usuários');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};

export const fetchOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/order`);
    if (!response.ok) {
      throw new Error('Erro ao buscar pedidos');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};
