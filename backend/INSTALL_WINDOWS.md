# Instalação no Windows - Solução para psycopg2-binary

Se você encontrar erros ao instalar `psycopg2-binary` no Windows, siga estas soluções:

## Solução 1: Instalar versão mais recente (Recomendado)

```bash
pip install --upgrade pip
pip install psycopg2-binary --upgrade
pip install -r requirements.txt
```

## Solução 2: Instalar PostgreSQL Client Tools

Se a Solução 1 não funcionar, instale o PostgreSQL Client Tools:

1. Baixe o PostgreSQL para Windows: https://www.postgresql.org/download/windows/
2. Durante a instalação, certifique-se de instalar as "Command Line Tools"
3. Adicione o PostgreSQL ao PATH do sistema:
   - Vá em: Configurações > Sistema > Variáveis de Ambiente
   - Adicione ao PATH: `C:\Program Files\PostgreSQL\<versão>\bin`
4. Reinicie o terminal e tente novamente:
   ```bash
   pip install -r requirements.txt
   ```

## Solução 3: Usar SQLite temporariamente (Desenvolvimento)

Para desenvolvimento local, você pode usar SQLite temporariamente:

1. Edite `config/settings.py` e altere o DATABASES para:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

2. Comente a linha do psycopg2-binary no requirements.txt:

```txt
# psycopg2-binary>=2.9.9  # Comentado para desenvolvimento com SQLite
```

3. Instale as dependências:

```bash
pip install -r requirements.txt
```

**Nota**: SQLite é apenas para desenvolvimento. Use PostgreSQL em produção.

## Solução 4: Usar psycopg (psycopg3) - Alternativa Moderna

Se nenhuma das soluções acima funcionar, você pode usar psycopg (psycopg3):

1. No `requirements.txt`, substitua:
   ```txt
   psycopg2-binary>=2.9.9
   ```
   Por:
   ```txt
   psycopg[binary]>=3.1.0
   ```

2. No `config/settings.py`, altere o ENGINE:
   ```python
   'ENGINE': 'django.db.backends.postgresql',
   ```
   Para:
   ```python
   'ENGINE': 'django.db.backends.postgresql',
   # psycopg3 funciona com o mesmo ENGINE
   ```

3. Instale:
   ```bash
   pip install -r requirements.txt
   ```

## Verificação

Após instalar, verifique se funcionou:

```bash
python -c "import psycopg2; print('psycopg2 instalado com sucesso!')"
```

Ou se usar psycopg3:

```bash
python -c "import psycopg; print('psycopg instalado com sucesso!')"
```







