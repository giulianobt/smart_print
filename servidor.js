const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Configuração CORS
app.use(cors());
app.use(express.json());

// Configuração da impressora
const IMPRESSORA_COMPARTILHAMENTO = 'Zebra'; // Nome do compartilhamento

console.log('🖨️ Servidor de Etiquetas');
console.log('==============================================');
console.log(`📡 Servidor rodando na porta ${PORT}`);
console.log(`🖨️ Impressora compartilhada: ${IMPRESSORA_COMPARTILHAMENTO}`);

// Função para listar impressoras compartilhadas
function listarImpressorasCompartilhadas() {
    return new Promise((resolve, reject) => {
        exec('net view localhost', (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Erro ao listar compartilhamentos:', error);
                reject(error);
                return;
            }

            const linhas = stdout.split('\n');
            const compartilhamentos = linhas
                .filter(linha => linha.includes('$') || linha.includes('Printer') || linha.includes('Zebra'))
                .map(linha => linha.trim())
                .filter(linha => linha.length > 0);

            resolve(compartilhamentos);
        });
    });
}



// Função para normalizar caracteres especiais
function normalizarCaracteres(texto) {
    return texto
        .replace(/ã/g, 'a')
        .replace(/á/g, 'a')
        .replace(/à/g, 'a')
        .replace(/â/g, 'a')
        .replace(/ä/g, 'a')
        .replace(/é/g, 'e')
        .replace(/è/g, 'e')
        .replace(/ê/g, 'e')
        .replace(/ë/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ì/g, 'i')
        .replace(/î/g, 'i')
        .replace(/ï/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ò/g, 'o')
        .replace(/ô/g, 'o')
        .replace(/õ/g, 'o')
        .replace(/ö/g, 'o')
        .replace(/ú/g, 'u')
        .replace(/ù/g, 'u')
        .replace(/û/g, 'u')
        .replace(/ü/g, 'u')
        .replace(/ç/g, 'c')
        .replace(/ñ/g, 'n')
        .replace(/Ã/g, 'A')
        .replace(/Á/g, 'A')
        .replace(/À/g, 'A')
        .replace(/Â/g, 'A')
        .replace(/Ä/g, 'A')
        .replace(/É/g, 'E')
        .replace(/È/g, 'E')
        .replace(/Ê/g, 'E')
        .replace(/Ë/g, 'E')
        .replace(/Í/g, 'I')
        .replace(/Ì/g, 'I')
        .replace(/Î/g, 'I')
        .replace(/Ï/g, 'I')
        .replace(/Ó/g, 'O')
        .replace(/Ò/g, 'O')
        .replace(/Ô/g, 'O')
        .replace(/Õ/g, 'O')
        .replace(/Ö/g, 'O')
        .replace(/Ú/g, 'U')
        .replace(/Ù/g, 'U')
        .replace(/Û/g, 'U')
        .replace(/Ü/g, 'U')
        .replace(/Ç/g, 'C')
        .replace(/Ñ/g, 'N');
}

// Função para gerar ZPL de etiqueta com caracteres corrigidos
function gerarZPLEtiqueta(dados) {
    const { estudantes_id, periodos, nome, url_check, numero_serie } = dados;

    // Normalizar caracteres especiais
    const nomeNormalizado = normalizarCaracteres(nome);

    // Verificar se periodos é um array ou string
    let periodosArray = periodos;
    if (typeof periodos === 'string') {
        periodosArray = [periodos];
    }

    // Normalizar cada período
    const periodosNormalizados = periodosArray.map(p => normalizarCaracteres(p));

    // Gerar linhas de períodos
    let periodosZPL = '';
    periodosNormalizados.forEach((periodo, index) => {
        const yPosition = 110 + (index * 30); // 30 pixels de espaçamento entre períodos
        periodosZPL += `^FO50,${yPosition}^A0N,25,25^FDPeriodo ${index + 1}: ${periodo}^FS\n`;
    });

    return `^XA
^FO50,30^A0N,35,35^FD${nomeNormalizado}^FS
^FO50,70^A0N,30,30^FDID: ${estudantes_id}^FS
${periodosZPL}^FO50,210^BQN,2,4^FDQA,${url_check}^FS
^FO420,340^A0N,25,25^FD${numero_serie}^FS
^XZ`;
}

// Função para imprimir etiqueta
function imprimirEtiqueta(zpl) {
    return new Promise((resolve, reject) => {
        const arquivoTemp = path.join(__dirname, 'etiqueta_temp.zpl');

        try {
            // Salvar arquivo com encoding UTF-8
            fs.writeFileSync(arquivoTemp, zpl, 'utf8');
            console.log('📄 Arquivo ZPL criado:', arquivoTemp);
            console.log('📝 ZPL:', zpl);

            // Enviar o ZPL para impressora
            const printerPath = `\\\\localhost\\${IMPRESSORA_COMPARTILHAMENTO}`;
            const comandoZPL = `COPY /B "${arquivoTemp}" "${printerPath}"`;
            console.log('🔄 Comando ZPL:', comandoZPL);

            exec(comandoZPL, (error, stdout, stderr) => {
                // Limpar arquivo temporário
                try {
                    if (fs.existsSync(arquivoTemp)) {
                        fs.unlinkSync(arquivoTemp);
                        console.log('🗑️ Arquivo temporário removido');
                    }
                } catch (cleanupError) {
                    console.error('Erro ao limpar arquivo temporário:', cleanupError);
                }

                if (error) {
                    console.error('❌ Erro na impressão:', error.message);
                    reject(error);
                    return;
                }

                if (stderr) {
                    console.log('⚠️ Stderr:', stderr);
                }

                console.log('✅ Comando executado com sucesso!');
                console.log('📊 stdout:', stdout);

                if (stdout.includes('1 arquivo(s) copiado(s)')) {
                    console.log('✅ Etiqueta enviada para impressora!');
                    resolve({ success: true, message: 'Etiqueta enviada' });
                } else {
                    console.log('❌ Etiqueta não foi enviada');
                    reject(new Error('Etiqueta não foi enviada'));
                }
            });
        } catch (error) {
            console.error('❌ Erro ao criar arquivo temporário:', error);
            reject(error);
        }
    });
}

// Rota principal
app.get('/', (req, res) => {
    res.json({
        message: 'Servidor de Etiquetas com Compartilhamento',
        status: 'online',
        impressora: IMPRESSORA_COMPARTILHAMENTO,
        endpoints: {
            '/imprimir': 'POST - Imprimir etiqueta',
            '/teste-impressao': 'GET - Teste de impressão',
            '/impressoras': 'GET - Listar compartilhamentos'
        }
    });
});

// Rota para imprimir etiqueta
app.post('/imprimir', async (req, res) => {
    try {
        const { estudantes_id, periodos, nome, url_check, numero_serie } = req.body;

        console.log('📨 Recebida requisição de impressão:');
        console.log('   - estudantes_id:', estudantes_id);
        console.log('   - periodos:', periodos);
        console.log('   - nome:', nome);
        console.log('   - numero_serie:', numero_serie);
        console.log('   - nome normalizado:', normalizarCaracteres(nome));

        // Validação dos dados
        if (!estudantes_id || !periodos || !nome) {
            return res.status(400).json({
                error: 'Dados incompletos',
                required: ['estudantes_id', 'periodos', 'nome']
            });
        }

        // Gerar ZPL
        const zpl = gerarZPLEtiqueta({ estudantes_id, periodos, nome, url_check, numero_serie });

        // Imprimir
        const resultado = await imprimirEtiqueta(zpl);

        res.json({
            success: true,
            message: 'Etiqueta enviada para impressora',
            dados: { estudantes_id, periodos, nome, url_check, numero_serie },
            nome_normalizado: normalizarCaracteres(nome),
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erro na rota /imprimir:', error.message);
        res.status(500).json({
            error: 'Erro ao imprimir etiqueta',
            message: error.message
        });
    }
});

// Rota para teste de impressão
app.get('/teste-impressao', async (req, res) => {
    try {
        console.log('🧪 Teste de impressão solicitado');

        const dadosTeste = {
            estudantes_id: 'TESTE123',
            periodos: ['BAURU [noite] - ITE', 'BAURU [integral] - UNESP'],
            nome: 'TESTE DE IMPRESSÃO',
            url_check: 'https://estudantes.smartfret.com.br/ck?h=1234567890',
            numero_serie: '123456789123'
        };

        const zpl = gerarZPLEtiqueta(dadosTeste);
        const resultado = await imprimirEtiqueta(zpl);

        res.json({
            success: true,
            message: 'Teste de impressão enviado',
            dados: dadosTeste,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erro no teste de impressão:', error.message);
        res.status(500).json({
            error: 'Erro no teste de impressão',
            message: error.message
        });
    }
});

// Rota para listar compartilhamentos
app.get('/impressoras', async (req, res) => {
    try {
        console.log('📋 Listando compartilhamentos...');

        const compartilhamentos = await listarImpressorasCompartilhadas();

        res.json({
            success: true,
            compartilhamentos: compartilhamentos,
            impressora_atual: IMPRESSORA_COMPARTILHAMENTO,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erro ao listar compartilhamentos:', error.message);
        res.status(500).json({
            error: 'Erro ao listar compartilhamentos',
            message: error.message
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado em http://localhost:${PORT}`);
    console.log('📋 Endpoints disponíveis:');
    console.log(`   GET  http://localhost:${PORT}/`);
    console.log(`   POST http://localhost:${PORT}/imprimir`);
    console.log(`   GET  http://localhost:${PORT}/teste-impressao`);
    console.log(`   GET  http://localhost:${PORT}/impressoras`);
    console.log('');
    console.log('💡 Para testar:');
    console.log(`   curl -X POST http://localhost:${PORT}/imprimir -H "Content-Type: application/json" -d "{\\"estudantes_id\\":\\"12345\\",\\"periodos\\":\\"2024.1\\",\\"nome\\":\\"João Silva\\",\\"numero_serie\\":\\"123456789123\\"}"`);
}); 