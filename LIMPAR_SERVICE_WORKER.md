# 🚨 Limpar Service Worker - Solução Rápida

## ⚡ Solução Imediata (Cole no Console do Navegador)

Abra o **Console do Navegador** (F12 → Console) e cole este código:

```javascript
// 1. Desregistrar todos os service workers
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
    console.log('Service Worker desregistrado:', registration.scope);
  }
});

// 2. Limpar todos os caches
caches.keys().then(function(names) {
  for (let name of names) {
    caches.delete(name);
    console.log('Cache deletado:', name);
  }
});

// 3. Recarregar a página
setTimeout(() => {
  console.log('Recarregando página...');
  location.reload(true);
}, 1000);
```

---

## 📋 Passo a Passo Manual

### Chrome/Edge:

1. **Abra DevTools** (F12)
2. **Application** → **Service Workers**
3. Clique em **Unregister** para cada service worker
4. **Application** → **Storage** → **Clear site data**
   - Marque todas as opções
   - Clique em **Clear site data**
5. **Network** → Marque **Disable cache**
6. **Recarregue** com Ctrl+Shift+R (ou Cmd+Shift+R no Mac)

### Firefox:

1. **Abra DevTools** (F12)
2. **Application** → **Service Workers**
3. Clique em **Unregister** para cada service worker
4. **Storage** → **Clear All**
5. **Network** → Marque **Disable cache**
6. **Recarregue** com Ctrl+Shift+R

---

## 🔄 Reiniciar Servidor de Desenvolvimento

Após limpar o service worker, **reinicie o servidor**:

```bash
# Pare o servidor (Ctrl+C)
# Depois inicie novamente
npm run dev
```

---

## ✅ Verificação

Após seguir os passos, você deve:

1. ✅ Não ver mais erros 404 no console
2. ✅ Não ver mensagens do workbox
3. ✅ A aplicação carregar normalmente
4. ✅ Ver "Running in development mode" no console

---

## 🛠️ Se Ainda Não Funcionar

### Opção 1: Modo Anônimo
Abra uma **janela anônima/privada** e acesse `localhost:3000`

### Opção 2: Limpar Dados do Site
1. Chrome: Configurações → Privacidade → Limpar dados de navegação
2. Selecione apenas `localhost:3000`
3. Limpe cookies e dados do site

### Opção 3: Desabilitar PWA Temporariamente
Se nada funcionar, você pode comentar o plugin PWA temporariamente:

```typescript
// Em vite.config.ts, comente o VitePWA:
plugins: [
  react(),
  // VitePWA({ ... })  // Comentado temporariamente
],
```

---

**Execute o código do console primeiro!** Isso deve resolver o problema imediatamente. 🚀

