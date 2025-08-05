const fs = require('fs');
const { exec } = require('child_process');

// Comando ZPL
const zpl = `
^XA
^FO100,100^A0N,40,40^FDTestando impressão ZPL!^FS
^FO100,150^BQN,2,4^FDhttps://exemplo.com^FS
^XZ
`;

// Caminho do arquivo temporário
const filePath = 'etiqueta_zpl.txt';
fs.writeFileSync(filePath, zpl);

// Nome do compartilhamento da impressora
const printerShareName = 'Zebra'; // Use o nome que definiu no compartilhamento
const printerPath = `\\\\localhost\\${printerShareName}`;

// Comando COPY para enviar diretamente
const command = `COPY /B "${filePath}" "${printerPath}"`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error('Erro ao enviar para impressora:', error.message);
        return;
    }
    if (stderr) {
        console.error('Stderr:', stderr);
        return;
    }
    console.log('Impressão enviada com sucesso!');
});
