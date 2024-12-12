export const getEmployee = async (expenseData) => {
    try {
        const response = await fetch('http://localhost:5000/api/emp', {
            method: 'POST',
            // Não define Content-Type explicitamente, pois o FormData já define isso
            body: expenseData, // Passa diretamente o FormData
        });

        if (!response.ok) {
            throw new Error('Erro ao criar Despesa');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
};