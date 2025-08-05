const http = require('http');

console.log('🖨️ Teste Simples do Servidor de Etiquetas');
console.log('===========================================');

// Função para fazer requisição HTTP
function fazerRequisicao(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    resolve({ status: res.statusCode, data: response });
                } catch (error) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// Teste principal
async function executarTeste() {
    try {
        console.log('🚀 Iniciando teste...');

        // Teste 1: Status do servidor
        console.log('\n1️⃣ Testando status do servidor...');
        const status = await fazerRequisicao('GET', '/');
        console.log('✅ Status:', status.status);
        console.log('📋 Dados:', JSON.stringify(status.data, null, 2));

        // Teste 2: Imprimir etiqueta
        console.log('\n2️⃣ Testando impressão de etiqueta...');
        const dados = {
            estudantes_id: '12345',
            periodos: ['2024.1', '2024.2', '2025.1'], // Array de períodos
            nome: 'João Silva Santos',
            url_check: 'https://exemplo.com/check/12345'
        };

        const impressao = await fazerRequisicao('POST', '/imprimir', dados);
        console.log('✅ Status:', impressao.status);
        console.log('📋 Dados:', JSON.stringify(impressao.data, null, 2));

        console.log('\n🎯 Teste concluído!');
        console.log('🔍 Verifique se saiu uma etiqueta na impressora Zebra');

    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
        console.log('💡 Certifique-se de que o servidor está rodando: node servidor_etiquetas_compartilhamento.js');
    }
}

// Executar teste
executarTeste(); 