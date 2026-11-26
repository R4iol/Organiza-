# Guia Prático do Aluno: Personalização, Deploy e Registro no INPI

Este guia mostra, passo a passo, como transformar este template no **seu próprio aplicativo**, colocá-lo no ar gratuitamente no **GitHub Pages** e gerar o **Hash SHA-512** para o registro de software no **INPI**.

---

## 1. Como Personalizar Seu App em 10 Minutos

Você só precisa editar **4 arquivos** para deixar o aplicativo com a cara do seu projeto:

### Passo A — Mudar as Cores (`style.css`)
Abra o arquivo `style.css` e altere as cores dentro do bloco `:root` (linhas 10 a 15):
- `--cor-primaria`: cor do cabeçalho e dos botões principais.
- `--cor-primaria-escura`: cor mais escura ao clicar nos botões.
- `--cor-secundaria`: cor dos preços/etiquetas de destaque.
- `--cor-fundo`: cor de fundo da tela.

### Passo B — Mudar Título e Campos (`index.html`)
Abra o arquivo `index.html` e localize os comentários em destaque:
- `<title>` e `<!-- === CABEÇALHO (APPBAR) === -->`: altere `"Meu App IFAP"` e o subtítulo para o nome do seu aplicativo.
- `<!-- === TELA DE CADASTRO (FORMULÁRIO) === -->`: ajuste os rótulos (`<label>`) e exemplos (`placeholder`) dos campos `CampoTitulo`, `CampoDescricao`, `CampoPreco` e `CampoImagem` para combinar com o seu nicho (ex.: *Nome do Prato*, *Ingredientes*, *Valor*, *Foto*).

### Passo C — Mudar Itens Iniciais, Conta Demo e Chaves de Memória (`app.js`)
Abra o arquivo `app.js` no **BLOCO 1**:
- Altere `CHAVE_STORAGE`, `CHAVE_USUARIOS` e `CHAVE_SESSAO` para usar o nome do seu app (ex.: `'ifap_acai_lista_itens'`).
- Edite `USUARIOS_INICIAIS` caso queira personalizar a conta de teste padrão (`aluno@ifap.edu.br` / `123456`).
- Edite os 2 objetos dentro de `ITENS_INICIAIS` com exemplos reais do seu tema.

### Passo D — Configurar Nome de Instalação (`manifest.json`)
Abra o arquivo `manifest.json` e atualize:
- `name`: nome completo do aplicativo.
- `short_name`: nome curto que aparece embaixo do ícone na tela inicial do celular (até 12 letras).
- `theme_color`: use a mesma cor de `--cor-primaria` do `style.css`.

---

## 2. Como Publicar Online no GitHub Pages (Sem Terminal — 5 Cliques)

Você não precisa usar comandos de Git para colocar seu aplicativo na internet:

1. **Crie um repositório público:** Acesse [github.com](https://github.com), clique em **`+`** ➔ **`New repository`**, escolha um nome sem espaços (ex.: `meu-app-ifap`), deixe marcado como **Public** e clique em **Create repository**.
2. **Envie os arquivos:** Na página do repositório criado, clique em **`Add file`** ➔ **`Upload files`**. Arraste todos os arquivos do seu projeto (incluindo a pasta `assets`) e clique em **Commit changes**.
3. **Abra as configurações:** Clique na aba **`Settings`** (no topo do repositório).
4. **Ative o GitHub Pages:** No menu lateral esquerdo, clique em **`Pages`**. Em *Build and deployment* ➔ *Branch*, selecione **`main`** e a pasta **`/ (root)`**, depois clique em **Save**.
5. **Copie sua URL pública:** Aguarde cerca de 1 a 2 minutos e atualize a página. O link do seu aplicativo aparecerá no topo (ex.: `https://seu-usuario.github.io/meu-app-ifap/`). Abra no celular e teste a opção **"Adicionar à tela inicial"**!

---

## 3. Como Preparar o Código e Gerar o Hash SHA-512 para o INPI

O registro no INPI exige o **Resumo Digital (Hash SHA-512)** do pacote compactado contendo o código-fonte final do seu programa.

### Passo 1 — Compactar a Pasta Limpa em `.zip`
1. Verifique se o aplicativo está funcionando perfeitamente e sem arquivos desnecessários (remova arquivos de rascunho ou temporários).
2. Mantenha na pasta apenas os arquivos do projeto (`index.html`, `style.css`, `app.js`, `manifest.json`, `sw.js`, `assets/icon.svg` e `README.md`).
3. Compacte essa pasta gerando um arquivo chamado, por exemplo, **`meu-app-ifap.zip`**.

> **Importante:** Depois de gerar o Hash SHA-512, **não altere nem recompacte** o arquivo `.zip`. Qualquer alteração de uma única letra muda completamente o hash!

### Passo 2 — Gerar o Hash SHA-512

#### No Windows (PowerShell):
Abra o PowerShell na pasta onde está o arquivo `.zip` e execute:

```powershell
Get-FileHash .\meu-app-ifap.zip -Algorithm SHA512
```

#### No Linux ou macOS (Terminal):
Abra o Terminal na pasta onde está o arquivo `.zip` e execute:

```bash
sha512sum meu-app-ifap.zip
```

### Passo 3 — Finalizar a Entrega para a Coordenação
1. Copie todo o código hexadecimal gerado (sequência longa de letras e números).
2. Abra o seu arquivo **`README.md`** e cole o hash no campo **Resumo Digital (Hash SHA-512)** da tabela **Ficha Técnica para Registro no INPI**.
3. Guarde uma cópia segura do arquivo `.zip` original e envie o **`.zip` + a Ficha Técnica preenchida** para a coordenação do curso no IFAP.
