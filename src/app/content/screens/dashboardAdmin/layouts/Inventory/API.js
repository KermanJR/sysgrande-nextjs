export const fetchItems = async () => {
  try {
    const response = await fetch('https://sysgrande-nodejs.onrender.com/api/items', { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar os itens');
    }
    const data = await response.json();
    return data; // Retorna os dados dos itens
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};

export const fetchRegionals = async () => {
  try {
    const response = await fetch('https://sysgrande-nodejs.onrender.com/api/regionals', { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar as regionais');
    }
    const data = await response.json();
    return data; // Retorna os dados dos itens
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};

export const deleteItemById = async (itemId) => {
  try {
    const response = await fetch(`hhttps://sysgrande-nodejs.onrender.com/api/items/${itemId}`, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar as regionais');
    }
    const data = await response.json();
    return data; // Retorna os dados dos itens
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};


