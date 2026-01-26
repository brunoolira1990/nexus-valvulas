# Como Corrigir o Layout Quebrado do Django Admin

## Problema
O Django Admin está mostrando uma caixa cinza grande e elementos visuais quebrados.

## Soluções

### 1. Verificar se DEBUG está True

No arquivo `backend/.env`, certifique-se de ter:

```env
DEBUG=True
```

### 2. Reiniciar o Servidor

Após coletar os arquivos estáticos, **sempre reinicie o servidor**:

```powershell
# Pare o servidor (CTRL+C)
# Depois reinicie:
python manage.py runserver
```

### 3. Limpar Cache do Navegador

1. Pressione **CTRL+SHIFT+DELETE**
2. Selecione "Imagens e arquivos em cache"
3. Limpe o cache
4. Recarregue a página com **CTRL+F5** (hard refresh)

### 4. Verificar se Arquivos Estáticos Estão Sendo Servidos

Acesse no navegador:
- `http://127.0.0.1:8000/static/admin/css/base.css`

Se abrir o arquivo CSS, os estáticos estão funcionando.

### 5. Verificar Console do Navegador

1. Pressione **F12** para abrir o DevTools
2. Vá na aba **Console**
3. Veja se há erros relacionados a arquivos CSS/JS não encontrados

### 6. Solução Alternativa: Usar Modo Anônimo

Abra o Django Admin em uma **janela anônima/privada** do navegador para evitar problemas de cache.

## Checklist

- [ ] DEBUG=True no .env
- [ ] Arquivos estáticos coletados (`python manage.py collectstatic`)
- [ ] Servidor reiniciado após coletar estáticos
- [ ] Cache do navegador limpo
- [ ] Página recarregada com CTRL+F5

## Se Nada Funcionar

Tente acessar diretamente a API REST (que não depende dos arquivos estáticos do admin):

- `http://127.0.0.1:8000/api/test`
- `http://127.0.0.1:8000/api/categories/`

A API REST funciona independentemente do Django Admin.







