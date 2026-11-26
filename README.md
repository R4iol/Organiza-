# [Organiza+]

> **Template Base PWA — Curso de Desenvolvimento de Apps (IFAP)**  
> Substitua os campos entre `[colchetes]` pelas informações reais do seu projeto antes de publicar e enviar para o registro no INPI.

---

## 1. Descrição Funcional

- **Problema Resolvido:** `[O Organiza+ facilita a organização e conclusão das tarefas do cotidiano, ajudando a visualizar o que precisa  fazer durante o dia e os compromissos futuros, com lembretes ao longo dia para não esquecer suas tarefas e eventos.]`
- **Público-Alvo:** `[Dicentes de intituições de ensino.]`
- **Principais Funcionalidades:**
  - Cadastro de contas, login local e tela de **Perfil** editável (`localStorage`);
  - Listagem dinâmica de registros com busca em tempo real;
  - Cadastro de novos itens com persistência local (`localStorage`);
  - Visualização detalhada em modal e exclusão segura;
  - Interface responsiva Mobile-First instalável na tela inicial do celular (PWA).

> **Conta de demonstração inclusa:** `aluno@ifap.edu.br` | Senha: `123456` *(autenticação local para fins didáticos e prototipagem)*.

---

## 2. Link do Aplicativo Online

**Acesse o aplicativo funcionando:** `[Cole aqui a URL do seu GitHub Pages — ex.: https://seu-usuario.github.io/meu-app-ifap/]`

---

## 3. Tecnologias Utilizadas

- **HTML5** semântico (estrutura das telas, formulários e modal);
- **CSS3 + Tailwind CSS** (estilização responsiva Mobile-First e variáveis globais de tema);
- **JavaScript (ES6+)** puro (manipulação do DOM, CRUD completo e persistência em `localStorage`);
- **PWA (Progressive Web App)** com `manifest.json` e Service Worker (`sw.js`) em estratégia *Network-First*.

---

## 4. Ficha Técnica para Registro no INPI (e-Software)

Preencha esta tabela com os dados oficiais do projeto para compor o dossiê de **Registro de Programa de Computador no INPI**:

| Campo | Informação |
| :--- | :--- |
| **Título do Programa** | `[Organiza+]` |
| **Linguagens de Programação** | `HTML5`, `CSS3`, `JavaScript` |
| **Tipo de Programa** | `[Aplicativo]` |
| **Campo de Aplicação** | `[Ex.: AD-01 — Administração / Comércio / Educação / Saúde / Serviços]` |
| **Autores (Nome Completo)** | `[Gabriel Raiol Passo]`, `[Carlly Vanessa Pereira de Paiva]` |
| **Turma / Instituição** | `Curso de Desenvolvimento de Apps — Instituto Federal do Amapá (IFAP)` |
| **Titularidade** | `[Nome do Titular dos Direitos — Aluno(a) ou Instituição conforme orientação da coordenação]` |
| **Data da Versão Final** | `[DD/MM/AAAA]` |
| **Algoritmo de Hash** | `SHA-512` |
| **Resumo Digital (Hash SHA-512)** | `[Cole aqui o código hexadecimal SHA-512 gerado do arquivo .zip do código-fonte]` |

---

## 5. Como Executar Localmente

Este projeto **não precisa de instalação nem build**:

1. Baixe ou clone esta pasta no seu computador.
2. Dê um duplo clique no arquivo `index.html` (ou abra com a extensão **Live Server**).
3. Para testar a instalação como aplicativo no celular, publique no **GitHub Pages** seguindo o arquivo [GUIA_ALUNO_DEPLOY_INPI.md](./GUIA_ALUNO_DEPLOY_INPI.md).
