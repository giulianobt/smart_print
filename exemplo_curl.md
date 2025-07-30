# Exemplos de uso do endpoint de impressão

## Teste com curl

### 1. Imagem simples (1x1 pixel preto)
```bash
curl -X POST http://localhost:5000/imprimir \
  -H "Content-Type: application/json" \
  -d '{
    "id": "12345",
    "nome": "João Silva",
    "periodo": "2024",
    "escola": "Escola ABC",
    "foto_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  }'
```

### 2. Teste sem imagem (apenas texto)
```bash
curl -X POST http://localhost:5000/imprimir \
  -H "Content-Type: application/json" \
  -d '{
    "id": "2024001",
    "nome": "Maria Santos",
    "periodo": "2024.1",
    "escola": "Escola Municipal São José",
    "foto_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  }'
```

### 3. Teste com dados diferentes
```bash
curl -X POST http://localhost:5000/imprimir \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TEST001",
    "nome": "Pedro Oliveira",
    "periodo": "2024.2",
    "escola": "Colégio Santa Maria",
    "foto_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  }'
```

## Respostas esperadas

### Sucesso (200 OK)
```
OK
```

### Erro de dados incompletos (500)
```
Dados incompletos
```

### Erro de processamento de imagem (500)
```
Erro ao processar imagem: [mensagem do erro]
```

## Especificações da etiqueta gerada

- **Formato**: Landscape (80mm x 50mm)
- **Resolução**: 203 DPI
- **Foto**: 3cm x 4cm (240x320 pixels) no canto superior esquerdo
- **Margem**: 5mm (40 dots)
- **Campos**: ID, Nome, Período, Escola

## Arquivo gerado

O endpoint gera um arquivo `output.png` com a etiqueta processada pela API Labelary. 