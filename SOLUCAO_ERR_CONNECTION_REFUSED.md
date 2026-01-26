# Solução: ERR_CONNECTION_REFUSED

## 🔴 Problema

O erro `ERR_CONNECTION_REFUSED` indica que o servidor Django não está respondendo, mesmo que a porta 8000 esteja em uso.

## ✅ Solução

### Opção 1: Reiniciar o servidor (Recomendado)

Execute o script de reinicialização:

```powershell
.\reiniciar-backend.ps1
```

Este script irá:
1. Parar qualquer processo na porta 8000
2. Reiniciar o servidor Django

### Opção 2: Parar e iniciar manualmente

1. **Pare o servidor atual:**
   - Vá até o terminal onde o servidor está rodando
   - Pressione `CTRL+C` para parar

2. **Inicie novamente:**
   ```powershell
   .\start-backend.ps1
   ```

### Opção 3: Verificar e iniciar

1. **Verifique o status:**
   ```powershell
   .\verificar-backend.ps1
   ```

2. **Se não estiver rodando, inicie:**
   ```powershell
   .\start-backend.ps1
   ```

## 🔍 Verificações Adicionais

### 1. Verificar se o servidor está rodando

```powershell
netstat -ano | findstr :8000
```

Se aparecer algo como `LISTENING`, a porta está em uso.

### 2. Testar se o servidor responde

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/test" -UseBasicParsing
```

Se retornar um JSON com `message: "Servidor funcionando!"`, está tudo ok.

### 3. Verificar logs do Django

No terminal onde o servidor está rodando, você deve ver:
- `Starting development server at http://127.0.0.1:8000/`
- Requisições sendo logadas quando você acessa a página

## 🚨 Problemas Comuns

### Servidor travado
- **Sintoma**: Porta em uso mas não responde
- **Solução**: Pare o processo e reinicie

### Porta já em uso por outro processo
- **Sintoma**: Erro ao iniciar servidor
- **Solução**: Use outra porta: `python manage.py runserver 8001`

### CORS bloqueando requisições
- **Sintoma**: Erro no console do navegador sobre CORS
- **Solução**: Verifique se `DEBUG=True` no `.env` do backend

## 📝 Checklist

- [ ] Servidor Django está rodando na porta 8000
- [ ] Servidor responde em `http://localhost:8000/api/test`
- [ ] Frontend está configurado para `http://localhost:8000/api`
- [ ] CORS está habilitado (DEBUG=True)

## 🎯 Após Reiniciar

1. **Aguarde alguns segundos** para o servidor iniciar completamente
2. **Recarregue a página** no navegador (CTRL+F5)
3. **Verifique o console** do navegador (F12) para ver se os erros desapareceram







