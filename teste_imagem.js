// Script para testar o endpoint com uma imagem base64 válida
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function testarEndpoint() {
    // Imagem base64 válida (1x1 pixel preto)
    const imagemBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

    const dados = {
        id: "12345",
        nome: "João Silva",
        periodo: "2024",
        escola: "Escola ABC",
        foto_base64: imagemBase64
    };

    try {
        const response = await fetch('http://localhost:5000/imprimir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await response.text();
        console.log('Resposta do servidor:', resultado);
        console.log('Status:', response.status);
    } catch (error) {
        console.error('Erro ao testar endpoint:', error);
    }
}

// Executar teste
testarEndpoint(); 