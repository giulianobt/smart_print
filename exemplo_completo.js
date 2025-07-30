// Exemplo completo com imagem maior para teste
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function testarComImagemMaior() {
    // Imagem base64 de um quadrado 10x10 pixels (mais realista)
    const imagemBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjY0NjdGNjgyNTE1MTFFQ0E1N0FFQjU1Q0I0NzA1QjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjY0NjdGNjk2NTE1MTFFQ0E1N0FFQjU1Q0I0NzA1QjQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCNjQ2N0Y2NjI1MTUxMUVDQTU3QUVCNTVDQjQ3MDVCNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNjQ2N0Y2NzI1MTUxMUVDQTU3QUVCNTVDQjQ3MDVCNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAEAAAAALAAAAAAoACgAAAITjI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTAAAOw==";

    const dados = {
        id: "2024001",
        nome: "Maria Santos",
        periodo: "2024.1",
        escola: "Escola Municipal São José",
        foto_base64: imagemBase64
    };

    console.log("Testando endpoint com imagem maior...");
    console.log("Dados enviados:", {
        id: dados.id,
        nome: dados.nome,
        periodo: dados.periodo,
        escola: dados.escola,
        foto_base64: dados.foto_base64.substring(0, 50) + "..." // Mostrar apenas o início
    });

    try {
        const response = await fetch('http://localhost:5000/imprimir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await response.text();
        console.log('✅ Resposta do servidor:', resultado);
        console.log('📊 Status:', response.status);

        if (response.status === 200) {
            console.log('🎉 Etiqueta gerada com sucesso!');
            console.log('📁 Verifique o arquivo output.png');
        }
    } catch (error) {
        console.error('❌ Erro ao testar endpoint:', error.message);
    }
}

// Executar teste
testarComImagemMaior(); 