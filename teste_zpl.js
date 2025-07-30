// Exemplo de teste para o código ZPL
const sharp = require("sharp");

async function gerarZPLTeste() {
    // Criar uma imagem de teste simples
    const larguraFoto = 240;
    const alturaFoto = 320;

    // Criar imagem de teste com um padrão simples
    const imagemTeste = Buffer.alloc(larguraFoto * alturaFoto);
    for (let i = 0; i < larguraFoto * alturaFoto; i++) {
        // Criar um padrão de xadrez simples
        const x = i % larguraFoto;
        const y = Math.floor(i / larguraFoto);
        imagemTeste[i] = ((x + y) % 20 < 10) ? 0 : 255;
    }

    // Processar imagem
    const imagemProcessada = await sharp(imagemTeste, {
        raw: {
            width: larguraFoto,
            height: alturaFoto,
            channels: 1
        }
    })
        .resize(larguraFoto, alturaFoto)
        .grayscale()
        .threshold(128)
        .raw()
        .toBuffer();

    // Converter para formato ZPL
    const bytesPorLinha = Math.ceil(larguraFoto / 8);
    const imagemZpl = Buffer.alloc(bytesPorLinha * alturaFoto);

    for (let y = 0; y < alturaFoto; y++) {
        for (let x = 0; x < larguraFoto; x++) {
            const pixelIndex = y * larguraFoto + x;
            const byteIndex = Math.floor(x / 8);
            const bitIndex = 7 - (x % 8);

            const pixel = imagemProcessada[pixelIndex];
            if (pixel < 128) {
                imagemZpl[y * bytesPorLinha + byteIndex] |= (1 << bitIndex);
            }
        }
    }

    // Gerar código ZPL
    const zpl = `
^XA
^MMT
^PW640
^LL400
^LS0
^FO40,40^GFA,${larguraFoto},${alturaFoto},${bytesPorLinha},${imagemZpl.toString('hex')}^FS
^FO300,40^A0N,25,25^FDID: 12345^FS
^FO300,70^A0N,25,25^FDNome: João Silva^FS
^FO300,100^A0N,25,25^FDPeríodo: 2024^FS
^FO300,130^A0N,25,25^FDEscola: Escola ABC^FS
^XZ`;

    console.log("Código ZPL gerado:");
    console.log(zpl);

    // Salvar em arquivo para teste
    require('fs').writeFileSync('teste.zpl', zpl);
    console.log("Código ZPL salvo em 'teste.zpl'");
}

gerarZPLTeste().catch(console.error); 