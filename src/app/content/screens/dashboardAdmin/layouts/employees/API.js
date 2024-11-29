export const fetchedEmployeesByCompany = async (companyName) => {
  try {
    const response = await fetch(`http://localhost:5000/api/employees?company=${companyName}`, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar os funcionários');
    }
    const data = await response.json();
    return data; // Retorna os dados dos despesas
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};

export const fetchedExpensesByCompany = async (companyName) => {
  try {
    const response = await fetch(`http://localhost:5000/api/expenses?company=${companyName}`, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar as despesas');
    }

    const data = await response.json();
    return data; // Retorna os dados das despesas
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};




export const deleteEmployeeById = async (employeeId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar funcionário.');
    }
    const data = await response.json();
    return data; // Retorna os dados dos itens
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};

