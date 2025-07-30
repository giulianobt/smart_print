// Teste com imagem base64 simples e válida
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function testarImagemSimples() {
    // Imagem base64 simples (1x1 pixel preto) - garantidamente válida
    const imagemBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

    const dados = {
        id: "TEST001",
        nome: "Teste Simples",
        periodo: "2024",
        escola: "Escola Teste",
        foto_base64: imagemBase64
    };

    console.log("🧪 Testando com imagem simples...");

    try {
        const response = await fetch('http://localhost:5000/imprimir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await response.text();
        console.log('✅ Resposta:', resultado);
        console.log('📊 Status:', response.status);

        if (response.status === 200) {
            console.log('🎉 Sucesso! Verifique output.png');
        }
    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
}

// Executar teste
testarImagemSimples(); 