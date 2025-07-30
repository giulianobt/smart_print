const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require("fs");
const sharp = require("sharp");

async function imprimir(id, nome, periodo, escola, foto_base64) {
    console.log("Imprimindo:", id, nome, periodo, escola, foto_base64);

    // Processar imagem base64
    let fotoData = foto_base64;

    // Remover prefixo data URL se existir
    if (foto_base64.startsWith('data:')) {
        fotoData = foto_base64.replace(/^data:image\/[a-z]+;base64,/, '');
    }

    // Validar se é base64 válido
    try {
        const fotoBuffer = Buffer.from(fotoData, 'base64');

        // Redimensionar e converter para preto e branco
        const larguraFoto = 240; // 3cm em pixels (203 DPI)
        const alturaFoto = 320;  // 4cm em pixels (203 DPI)

        const imagemProcessada = await sharp(fotoBuffer)
            .resize(larguraFoto, alturaFoto)
            .grayscale()
            .threshold(128) // Converter para preto e branco
            .raw()
            .toBuffer();

        // Converter para formato ZPL (1 bit por pixel)
        const bytesPorLinha = Math.ceil(larguraFoto / 8);
        const imagemZpl = Buffer.alloc(bytesPorLinha * alturaFoto);

        for (let y = 0; y < alturaFoto; y++) {
            for (let x = 0; x < larguraFoto; x++) {
                const pixelIndex = y * larguraFoto + x;
                const byteIndex = Math.floor(x / 8);
                const bitIndex = 7 - (x % 8); // MSB first

                const pixel = imagemProcessada[pixelIndex];
                if (pixel < 128) { // Pixel preto
                    imagemZpl[y * bytesPorLinha + byteIndex] |= (1 << bitIndex);
                }
            }
        }

        // Código ZPL para etiqueta landscape 80mm x 50mm (203 DPI)
        // 80mm = 3.15 polegadas = 640 dots (203 DPI)
        // 50mm = 1.97 polegadas = 400 dots (203 DPI)
        // Margem 5mm = 0.2" = 40 dots

        const zpl = `
^XA
^MMT
^PW640
^LL400
^LS0
^FO40,40^GFA,${larguraFoto},${alturaFoto},${bytesPorLinha},${imagemZpl.toString('hex')}^FS
^FO300,40^A0N,25,25^FDID: ${id}^FS
^FO300,70^A0N,25,25^FDNome: ${nome}^FS
^FO300,100^A0N,25,25^FDPeríodo: ${periodo}^FS
^FO300,130^A0N,25,25^FDEscola: ${escola}^FS
^XZ`;

        try {
            const response = await fetch('http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: zpl
            });

            const buffer = await response.buffer();
            fs.writeFileSync('output.png', buffer);
            console.log('Etiqueta gerada em output.png');
            return true;
        } catch (error) {
            console.error('Erro ao gerar etiqueta:', error);
            throw error;
        }
    } catch (error) {
        console.error('Erro ao processar imagem:', error);
        throw new Error('Erro ao processar imagem: ' + error.message);
    }

    try {
        const response = await fetch('http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: zpl
        });

        const buffer = await response.buffer();
        fs.writeFileSync('output.png', buffer);
        console.log('Etiqueta gerada em output.png');
        return true;
    } catch (error) {
        console.error('Erro ao gerar etiqueta:', error);
        throw error;
    }
}

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // habilita acesso via navegador
app.use(express.json());

app.post("/imprimir", async (req, res) => {
    try {
        if (!req.body.id || !req.body.nome || !req.body.periodo || !req.body.escola || !req.body.foto_base64) {
            throw new Error("Dados incompletos");
        }
        await imprimir(req.body.id, req.body.nome, req.body.periodo, req.body.escola, req.body.foto_base64);
        res.send("OK");
    } catch (error) {
        console.error('Erro no endpoint:', error);
        res.status(500).send(error.message);
    }
});

app.listen(5000, () => console.log("Servidor local rodando na porta 5000"));
