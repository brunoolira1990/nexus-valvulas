# Como Testar a API

## 1. Iniciar o Servidor

```powershell
cd C:\Users\Bruno\Documents\nexus-valvulas\backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

O servidor deve iniciar em: `http://127.0.0.1:8000/`

## 2. URLs Disponíveis

### Endpoints Públicos (sem autenticação):

- **Teste do servidor**: 
  - `GET http://127.0.0.1:8000/api/test`
  - Ou no navegador: http://127.0.0.1:8000/api/test

- **Lista categorias**: 
  - `GET http://127.0.0.1:8000/api/categories/`

- **Lista produtos**: 
  - `GET http://127.0.0.1:8000/api/products/`

- **Login**: 
  - `POST http://127.0.0.1:8000/api/auth/login`
  - Body: `{"email": "admin@nexus.com", "password": "admin123"}`

- **Contato**: 
  - `POST http://127.0.0.1:8000/api/contact`

### Endpoints Admin (requer autenticação JWT):

- `POST /api/categories/` - Criar categoria
- `POST /api/products/` - Criar produto
- `POST /api/blog/posts/` - Criar post

## 3. Testar no Navegador

Abra no navegador:
- http://127.0.0.1:8000/api/test

Deve retornar JSON:
```json
{
  "message": "Servidor funcionando!",
  "timestamp": "2025-01-27T..."
}
```

## 4. Testar com PowerShell (Invoke-WebRequest)

```powershell
# Teste básico
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/test" | Select-Object -ExpandProperty Content

# Ou com curl (se disponível)
curl http://127.0.0.1:8000/api/test
```

## 5. Verificar se o Servidor Está Rodando

Se você receber "Not Found", verifique:

1. **O servidor está rodando?**
   - Você deve ver no terminal: "Starting development server at http://127.0.0.1:8000/"

2. **A URL está correta?**
   - Use: `http://127.0.0.1:8000/api/test` (não `http://localhost:8000/api/test`)
   - Ou: `http://localhost:8000/api/test` (se configurado)

3. **A porta está correta?**
   - Por padrão é 8000, mas pode estar em outra porta se 8000 estiver ocupada

## 6. Erros Comuns

### "Not Found"
- Verifique se o servidor está rodando
- Verifique se a URL está correta (deve ter `/api/` antes do endpoint)
- Tente: `http://127.0.0.1:8000/api/test`

### "Connection refused"
- O servidor não está rodando
- Execute: `python manage.py runserver`

### "500 Internal Server Error"
- Verifique os logs no terminal
- Pode ser problema de banco de dados ou configuração







