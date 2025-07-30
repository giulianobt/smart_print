// Exemplo simplificado do código ZPL para etiqueta landscape 80mm x 50mm
// Formato: Landscape (80mm x 50mm)
// Resolução: 203 DPI
// Foto: 3cm x 4cm (240x320 pixels) no canto superior esquerdo
// Margem: 5mm (40 dots)

function gerarZPLSimples(id, nome, periodo, escola) {
    // Dados de imagem de exemplo (padrão simples)
    const larguraFoto = 240;
    const alturaFoto = 320;
    const bytesPorLinha = Math.ceil(larguraFoto / 8);

    // Criar padrão simples para teste
    const imagemHex = "FF".repeat(bytesPorLinha * alturaFoto); // Fundo branco

    const zpl = `
^XA
^MMT
^PW640
^LL400
^LS0
^FO40,40^GFA,${larguraFoto},${alturaFoto},${bytesPorLinha},${imagemHex}^FS
^FO300,40^A0N,25,25^FDID: ${id}^FS
^FO300,70^A0N,25,25^FDNome: ${nome}^FS
^FO300,100^A0N,25,25^FDPeríodo: ${periodo}^FS
^FO300,130^A0N,25,25^FDEscola: ${escola}^FS
^XZ`;

    return zpl;
}

// Exemplo de uso
const codigoZPL = gerarZPLSimples("12345", "João Silva", "2024", "Escola ABC");
console.log("Código ZPL para etiqueta landscape 80mm x 50mm:");
console.log(codigoZPL);

// Salvar em arquivo
require('fs').writeFileSync('etiqueta_landscape.zpl', codigoZPL);
console.log("\nCódigo ZPL salvo em 'etiqueta_landscape.zpl'"); 