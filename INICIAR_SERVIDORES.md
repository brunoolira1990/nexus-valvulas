# Como Iniciar os Servidores

## 🚀 Iniciar Backend Django

Abra um terminal PowerShell e execute:

```powershell
cd C:\Users\Bruno\Documents\nexus-valvulas\backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

**Você deve ver:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

✅ Backend rodando em: `http://127.0.0.1:8000` ou `http://localhost:8000`

---

## 🎨 Iniciar Frontend React

Abra **OUTRO terminal PowerShell** (deixe o backend rodando) e execute:

```powershell
cd C:\Users\Bruno\Documents\nexus-valvulas
npm run dev
```

**Ou se não funcionar:**
```powershell
npx vite
```

**Você deve ver:**
```
  VITE v5.4.19  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

✅ Frontend rodando em: `http://localhost:5173`

---

## 📋 Checklist

- [ ] Backend Django rodando (porta 8000)
- [ ] Frontend React rodando (porta 5173)
- [ ] Dois terminais abertos (um para cada servidor)

---

## 🔍 Verificar se Está Rodando

### Backend Django
Acesse no navegador: `http://localhost:8000/api/test`

Deve retornar JSON:
```json
{
  "message": "Servidor funcionando!",
  "timestamp": "..."
}
```

### Frontend React
Acesse no navegador: `http://localhost:5173`

Deve abrir a página inicial do site.

---

## ⚠️ Problemas Comuns

### "ERR_CONNECTION_REFUSED"
- **Causa**: Servidor não está rodando
- **Solução**: Inicie o servidor (backend ou frontend)

### "Porta já em uso"
- **Causa**: Outro processo está usando a porta
- **Solução**: 
  - Pare o processo: `CTRL+C` no terminal
  - Ou use outra porta: `python manage.py runserver 8001`

### "Vite não encontrado"
- **Causa**: Dependências não instaladas
- **Solução**: `npm install`

---

## 🎯 Ordem Correta de Inicialização

1. **Primeiro**: Inicie o Backend Django
2. **Depois**: Inicie o Frontend React
3. **Acesse**: `http://localhost:5173` (frontend)

O frontend vai fazer requisições para `http://localhost:8000` (backend).







