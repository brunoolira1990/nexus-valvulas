# Solução para Problemas de Instalação no Windows

## Problema: Pillow não instala

O Pillow 10.2.0 pode ter problemas de compilação no Windows. Siga estes passos:

### Solução 1: Instalar Pillow separadamente (Recomendado)

```bash
# Ative o venv primeiro
.\venv\Scripts\activate

# Atualize o pip
python -m pip install --upgrade pip setuptools wheel

# Instale Pillow com versão mais recente (tem wheels pré-compilados)
pip install Pillow

# Depois instale o resto
pip install -r requirements.txt --no-deps
pip install Django==5.0.1 djangorestframework==3.14.0 djangorestframework-simplejwt==5.3.0 django-cors-headers==4.3.1 python-decouple==3.8
```

### Solução 2: Instalar sem Pillow (se não precisar de processamento de imagens agora)

Se você não precisa processar imagens imediatamente, pode instalar sem o Pillow:

```bash
pip install Django==5.0.1 djangorestframework==3.14.0 djangorestframework-simplejwt==5.3.0 django-cors-headers==4.3.1 python-decouple==3.8 psycopg2-binary
```

O Pillow pode ser instalado depois quando necessário.

### Solução 3: Usar requirements alternativo

```bash
# Instale as dependências básicas
pip install -r requirements-windows.txt

# Depois instale psycopg2 e Pillow separadamente
pip install psycopg2-binary Pillow
```

### Solução 4: Instalar Visual C++ Build Tools (se nada funcionar)

O Pillow precisa de compiladores C++ no Windows. Instale:

1. Baixe "Build Tools for Visual Studio": https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
2. Durante a instalação, selecione "C++ build tools"
3. Reinicie o terminal e tente novamente

### Verificação

Após instalar, verifique:

```bash
python -c "import django; print('Django:', django.get_version())"
python -c "import rest_framework; print('DRF instalado')"
python -c "import PIL; print('Pillow instalado')"
```







