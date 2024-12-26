const URL = 'https://sysgrande-nodejs.onrender.com/api/'
const URL_LOCAL = 'http://localhost:5000/api/'

export const fetchTasks = async () => {
  try {
    const response = await fetch(`${URL_LOCAL}tasks`, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar os tarefas');
    }
    const data = await response.json();
    return data; // Retorna os dados das tarefas
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};

export const createTasks = async (task) => {
  try {
    const response = await fetch(`${URL_LOCAL}tasks`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task), 

    });
    if (!response.ok) {
      throw new Error('Erro ao criar tarefa');
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};

export const updateTasks = async (task, id) => {
  try {
    const response = await fetch(`${URL_LOCAL}tasks/${id}`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar tarefa');
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
};

export const deleteTaskById = async (taskId) => {
  try {
    const response = await fetch(`${URL_LOCAL}tasks/${taskId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      return true;
    } else {
      console.error("Erro na exclusão da tarefa:", await response.json());
      return false;
    }
  } catch (error) {
    console.error("Erro na chamada da API:", error);
    return false;
  }
};



