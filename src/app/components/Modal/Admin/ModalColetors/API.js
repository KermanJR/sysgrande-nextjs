
const URL = 'https://sysgrande-nodejs-1.onrender.com/api/'
const URL_LOCAL = 'http://localhost:5000/api/'

export const fetchedSuppliersByCompany = async (companyName) => {
  try {
    const response = await fetch(
      `${URL_LOCAL}supplier?company=${companyName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar os fornecedores");
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
};

export const createCollector = async (collectorData) => {
  try {
    const response = await fetch(
      `${URL_LOCAL}collectors`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Certifique-se que o backend aceita JSON
        },
        body: JSON.stringify(collectorData), // Converta o objeto em JSON
      }
      
    );

    if (!response.ok) {
      throw new Error("Erro ao criar coletor");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
};


export const fetchedEmployeesByCompany = async (companyName) => {
    try {
      const response = await fetch(
        `${URL_LOCAL}employees?company=${companyName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar os funcionários");
      }
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error("Erro:", error);
      return [];
    }
  };
  
export const updateCollector = async (collectorData, id) => {
  try {
    const response = await fetch(
      `${URL_LOCAL}collectors/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Certifique-se que o backend aceita JSON
        },
        body: JSON.stringify(collectorData), // Converta o objeto em JSON
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao editar coletor");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
};

export const fetchRegionals = async () => {
  try {
    const response = await fetch(
      `${URL_LOCAL}regionals`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar as regionais");
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
};

export const fetchMunicipios = async () => {
  try {
    const response = await fetch(
      `${URL_LOCAL}municipios`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar os municipios");
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
};

export const fetchLocals = async () => {
  try {
    const response = await fetch(
      `${URL_LOCAL}local`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar as localidades");
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
};


