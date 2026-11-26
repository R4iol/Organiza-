/* ==========================================================================
   APP.JS — LÓGICA COMPLETA DO APLICATIVO (PWA IFAP)
   ==========================================================================
   PONTE DIDÁTICA (FLUTTERFLOW ➔ JAVASCRIPT PURO):
   - Data Schema (ItemModel)             ➔ Objeto { id, titulo, descricao, preco, imagem, criadoEm }
   - App State (listaItens, Persisted)   ➔ Array salvo no localStorage do navegador
   - Authenticated User                  ➔ Objeto salvo em CHAVE_SESSAO no localStorage
   - Generate Dynamic Children           ➔ Função renderizarLista() usando .map()
   - Update App State (Add to List)      ➔ Função cadastrarItem()
   - Show Snack Bar                      ➔ Função mostrarSnackBar()
   ========================================================================== */

/* ==========================================================================
   BLOCO 1: CONFIGURAÇÃO E CHAVES DE MEMÓRIA
   DICA PARA O ALUNO: Altere as chaves abaixo para o nome do seu app e edite
   os 2 itens de exemplo em ITENS_INICIAIS para combinar com o seu tema!
   ========================================================================== */

const CHAVE_STORAGE = 'ifap_app_lista_itens';
const CHAVE_USUARIOS = 'ifap_app_usuarios';
const CHAVE_SESSAO = 'ifap_app_usuario_logado';
const IMAGEM_PADRAO = './assets/icon.svg';

/**
 * Conta de demonstração criada automaticamente na primeira abertura do app
 * para facilitar testes rápidos em sala de aula.
 */
const USUARIOS_INICIAIS = [
  {
    id: 'user_demo_ifap',
    nome: 'Aluno Demonstração',
    email: 'aluno@ifap.edu.br',
    senha: '123456',
    bio: 'Estudante do Curso de Desenvolvimento de Apps • IFAP',
    foto: '',
    criadoEm: 'Conta de demonstração'
  }
];

/**
 * Itens iniciais de exemplo (equivalente ao "Default Value" do App State).
 * Eles são carregados automaticamente apenas na PRIMEIRA vez que o app é aberto.
 */
const ITENS_INICIAIS = [
  {
    id: '1700000000001',
    titulo: 'Açaí Médio com Tapioca',
    descricao: 'Polpa de açaí batida na hora acompanhada de farinha de tapioca crocante. Exemplo de item cadastrado no template base do IFAP.',
    preco: 'R$ 18,00',
    imagem: '',
    criadoEm: 'Hoje • Exemplo inicial'
  },
  {
    id: '1700000000002',
    titulo: 'Oficina de Desenvolvimento PWA',
    descricao: 'Encontro prático para transformar protótipos do FlutterFlow em código real publicado no GitHub Pages e pronto para registro no INPI.',
    preco: 'Gratuito • IFAP',
    imagem: '',
    criadoEm: 'Hoje • Exemplo inicial'
  }
];

/* Variável auxiliar para controlar o tempo de exibição da SnackBar */
let temporizadorSnackBar = null;

/* ==========================================================================
   BLOCO 2: ESTADO DO APP (App State com Persisted = true no localStorage)
   ========================================================================== */

/**
 * Carrega a lista de itens salva no navegador (localStorage).
 * Se for o primeiro acesso (valor null), inicializa com ITENS_INICIAIS.
 * @returns {Array<Object>} Lista de objetos no formato ItemModel.
 */
function carregarItens() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_STORAGE);

    // Primeiro acesso do usuário: grava e devolve os itens de exemplo
    if (dadosSalvos === null) {
      salvarItens(ITENS_INICIAIS);
      return [...ITENS_INICIAIS];
    }

    const listaConvertida = JSON.parse(dadosSalvos);
    return Array.isArray(listaConvertida) ? listaConvertida : [];
  } catch (erro) {
    console.warn('Não foi possível ler o localStorage. Usando lista inicial.', erro);
    return [...ITENS_INICIAIS];
  }
}

/**
 * Salva o array atualizado de itens no localStorage convertendo para texto JSON.
 * @param {Array<Object>} lista - Lista completa de itens do aplicativo.
 */
function salvarItens(lista) {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista));
  } catch (erro) {
    console.error('Erro ao salvar dados no localStorage:', erro);
    mostrarSnackBar('Não foi possível salvar os dados no navegador.');
  }
}

/**
 * Carrega a lista de usuários cadastrados localmente.
 * @returns {Array<Object>}
 */
function carregarUsuarios() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_USUARIOS);

    if (dadosSalvos === null) {
      salvarUsuarios(USUARIOS_INICIAIS);
      return [...USUARIOS_INICIAIS];
    }

    const lista = JSON.parse(dadosSalvos);
    return Array.isArray(lista) ? lista : [...USUARIOS_INICIAIS];
  } catch (erro) {
    console.warn('Erro ao ler usuários salvos:', erro);
    return [...USUARIOS_INICIAIS];
  }
}

/**
 * Salva a lista de usuários cadastrados no localStorage.
 * @param {Array<Object>} lista
 */
function salvarUsuarios(lista) {
  try {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(lista));
  } catch (erro) {
    console.error('Erro ao salvar usuários:', erro);
  }
}

/**
 * Retorna o usuário atualmente logado (equivalente ao "Authenticated User").
 * @returns {Object | null}
 */
function obterUsuarioLogado() {
  try {
    const sessao = localStorage.getItem(CHAVE_SESSAO);
    return sessao ? JSON.parse(sessao) : null;
  } catch (erro) {
    console.warn('Erro ao ler sessão do usuário:', erro);
    return null;
  }
}

/**
 * Grava os dados do usuário logado na sessão local.
 * @param {Object} usuario
 */
function salvarUsuarioLogado(usuario) {
  try {
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario));
  } catch (erro) {
    console.error('Erro ao salvar sessão:', erro);
  }
}

/* ==========================================================================
   BLOCO 3: NAVEGAÇÃO ENTRE TELAS E MODAL DE DETALHES
   ========================================================================== */

/**
 * Alterna entre as telas 'home', 'cadastro' e 'perfil', atualizando a Bottom NavBar.
 * @param {'home' | 'cadastro' | 'perfil'} nomeTela
 */
function mostrarTela(nomeTela) {
  const telas = {
    home: document.getElementById('tela-home'),
    cadastro: document.getElementById('tela-cadastro'),
    perfil: document.getElementById('tela-perfil')
  };

  const botoesNav = {
    home: document.getElementById('nav-home'),
    cadastro: document.getElementById('nav-cadastro'),
    perfil: document.getElementById('nav-perfil')
  };

  Object.keys(telas).forEach((chave) => {
    const secao = telas[chave];
    const botao = botoesNav[chave];
    if (!secao || !botao) return;

    if (chave === nomeTela) {
      secao.classList.remove('hidden');
      botao.classList.remove('nav-inativa');
      botao.classList.add('nav-ativa');
      botao.setAttribute('aria-current', 'page');
    } else {
      secao.classList.add('hidden');
      botao.classList.remove('nav-ativa');
      botao.classList.add('nav-inativa');
      botao.removeAttribute('aria-current');
    }
  });

  if (nomeTela === 'cadastro') {
    const campoTitulo = document.getElementById('CampoTitulo');
    if (campoTitulo) campoTitulo.focus();
  }

  if (nomeTela === 'perfil') {
    renderizarPerfil();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  atualizarIcones();
}

/**
 * Abre o Modal de Detalhes preenchendo os dados do item selecionado.
 * @param {string} id - Identificador único do item.
 */
function abrirDetalhes(id) {
  const lista = carregarItens();
  const item = lista.find((registro) => registro.id === id);

  if (!item) return;

  const modal = document.getElementById('modal-detalhes');
  const imgEl = document.getElementById('detalhe-imagem');
  const tituloEl = document.getElementById('detalhe-titulo');
  const precoEl = document.getElementById('detalhe-preco');
  const descricaoEl = document.getElementById('detalhe-descricao');
  const dataEl = document.getElementById('detalhe-data');
  const btnExcluir = document.getElementById('btn-excluir-detalhe');

  // Configura a imagem com fallback automático caso o link esteja vazio ou quebrado
  imgEl.onerror = function () {
    this.onerror = null;
    this.src = IMAGEM_PADRAO;
  };
  imgEl.src = obterUrlImagemSegura(item.imagem);
  imgEl.alt = item.titulo;

  // Usa textContent (seguro contra XSS) para preencher os textos do modal
  tituloEl.textContent = item.titulo;
  descricaoEl.textContent = item.descricao;
  dataEl.textContent = item.criadoEm || 'Data não informada';

  if (item.preco && item.preco.trim() !== '') {
    precoEl.textContent = item.preco;
    precoEl.classList.remove('hidden');
  } else {
    precoEl.textContent = '';
    precoEl.classList.add('hidden');
  }

  // Vincula o botão de excluir ao ID deste item específico
  btnExcluir.onclick = () => excluirItem(item.id);

  modal.classList.remove('hidden');
  atualizarIcones();
}

/**
 * Fecha o Modal de Detalhes.
 */
function fecharDetalhes() {
  const modal = document.getElementById('modal-detalhes');
  if (modal) {
    modal.classList.add('hidden');
  }
}

/* ==========================================================================
   BLOCO 4: RENDERIZAÇÃO DINÂMICA (Generate Dynamic Children)
   ========================================================================== */

/**
 * Sanitiza/escapa caracteres especiais de HTML para evitar quebra de layout
 * ou injeção de código malicioso (XSS) ao montar os cards com innerHTML.
 * @param {string} texto
 * @returns {string}
 */
function escaparHTML(texto) {
  if (typeof texto !== 'string') return '';
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Valida a URL da imagem para aceitar apenas links seguros (http, https ou relativo).
 * Caso contrário, retorna o ícone padrão local do aplicativo.
 * @param {string} url
 * @returns {string}
 */
function obterUrlImagemSegura(url) {
  if (!url || typeof url !== 'string') return IMAGEM_PADRAO;
  const limpa = url.trim();
  if (
    limpa.startsWith('https://') ||
    limpa.startsWith('http://') ||
    limpa.startsWith('./')
  ) {
    return limpa;
  }
  return IMAGEM_PADRAO;
}

/**
 * Lê os itens do App State, aplica o filtro de busca e renderiza os cards no DOM.
 * Equivalente ao "Generate Dynamic Children" do FlutterFlow usando .map().
 * @param {string} [filtro=''] - Texto digitado no campo de busca.
 */
function renderizarLista(filtro = '') {
  const containerLista = document.getElementById('lista-itens');
  const estadoVazio = document.getElementById('estado-vazio');
  const estadoVazioTitulo = document.getElementById('estado-vazio-titulo');
  const estadoVazioTexto = document.getElementById('estado-vazio-texto');
  const btnAtalhoCadastro = document.getElementById('btn-atalho-cadastro');
  const contadorItens = document.getElementById('contador-itens');
  const statusFiltro = document.getElementById('status-filtro');

  const todosItens = carregarItens();
  const termo = filtro.trim().toLowerCase();

  // Atualiza o badge no cabeçalho com o total real de itens salvos
  const total = todosItens.length;
  contadorItens.textContent = total === 1 ? '1 item' : `${total} itens`;

  // Filtra os itens pelo título ou pela descrição em tempo real
  const itensFiltrados = termo
    ? todosItens.filter((item) => {
        const titulo = (item.titulo || '').toLowerCase();
        const descricao = (item.descricao || '').toLowerCase();
        return titulo.includes(termo) || descricao.includes(termo);
      })
    : todosItens;

  // Exibe aviso discreto quando há filtro ativo
  if (termo) {
    statusFiltro.textContent = `${itensFiltrados.length} encontrado(s)`;
    statusFiltro.classList.remove('hidden');
  } else {
    statusFiltro.classList.add('hidden');
  }

  // Se não houver itens para exibir, mostra o bloco de Estado Vazio
  if (itensFiltrados.length === 0) {
    containerLista.innerHTML = '';
    estadoVazio.classList.remove('hidden');

    if (termo && todosItens.length > 0) {
      estadoVazioTitulo.textContent = 'Nenhum resultado encontrado';
      estadoVazioTexto.textContent = `Não encontramos itens contendo "${filtro.trim()}". Tente outro termo.`;
      btnAtalhoCadastro.classList.add('hidden');
    } else {
      estadoVazioTitulo.textContent = 'Nenhum item cadastrado ainda';
      estadoVazioTexto.textContent = 'Comece adicionando o primeiro registro para vê-lo aparecer nesta lista.';
      btnAtalhoCadastro.classList.remove('hidden');
    }

    atualizarIcones();
    return;
  }

  // Há itens para exibir: oculta o estado vazio e gera os CardItem com .map()
  estadoVazio.classList.add('hidden');

  const htmlCards = itensFiltrados
    .map((item) => {
      const idSeguro = escaparHTML(item.id);
      const tituloSeguro = escaparHTML(item.titulo);
      const descricaoSegura = escaparHTML(item.descricao);
      const precoSeguro = escaparHTML(item.preco || '');
      const imagemSegura = escaparHTML(obterUrlImagemSegura(item.imagem));

      return `
        <article
          onclick="abrirDetalhes('${idSeguro}')"
          class="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer flex gap-3.5 items-center animar-entrada"
        >
          <!-- Miniatura da Imagem com fallback automático -->
          <img
            src="${imagemSegura}"
            alt="${tituloSeguro}"
            loading="lazy"
            onerror="this.onerror=null; this.src='${IMAGEM_PADRAO}';"
            class="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
          />

          <!-- Conteúdo textual do CardItem -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-1">
              <h3 class="text-sm font-bold text-slate-800 truncate">
                ${tituloSeguro}
              </h3>
              ${
                precoSeguro
                  ? `<span class="text-tema-secundario bg-emerald-50 text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0">${precoSeguro}</span>`
                  : ''
              }
            </div>

            <p class="text-xs text-slate-500 leading-relaxed texto-duas-linhas mb-2">
              ${descricaoSegura}
            </p>

            <div class="flex items-center justify-between">
              <span class="text-[11px] text-slate-400 truncate">
                ${escaparHTML(item.criadoEm || '')}
              </span>
              <span class="text-tema-primario text-xs font-semibold inline-flex items-center gap-0.5 shrink-0">
                Ver Mais
                <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
              </span>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  containerLista.innerHTML = htmlCards;
  atualizarIcones();
}

/* ==========================================================================
   BLOCO 5: AÇÕES CRUD DE ITENS (Update App State + Show Snack Bar)
   ========================================================================== */

/**
 * Exibe a notificação flutuante na parte inferior da tela.
 * Equivalente à ação "Show Snack Bar" do FlutterFlow.
 * @param {string} mensagem
 */
function mostrarSnackBar(mensagem) {
  const snackbar = document.getElementById('snackbar');
  const texto = document.getElementById('snackbar-texto');

  if (!snackbar || !texto) return;

  texto.textContent = mensagem;
  snackbar.classList.remove('snackbar-oculto');
  snackbar.classList.add('snackbar-visivel');

  // Cancela o temporizador anterior caso o usuário faça ações rápidas
  if (temporizadorSnackBar) {
    clearTimeout(temporizadorSnackBar);
  }

  temporizadorSnackBar = setTimeout(() => {
    snackbar.classList.remove('snackbar-visivel');
    snackbar.classList.add('snackbar-oculto');
  }, 3000);
}

/**
 * Cadastra um novo item a partir do formulário, salva no localStorage,
 * limpa os campos, exibe a SnackBar e retorna para a Home.
 * Equivalente ao "Update App State (Add to List)".
 * @param {SubmitEvent} evento
 */
function cadastrarItem(evento) {
  evento.preventDefault();

  const campoTitulo = document.getElementById('CampoTitulo');
  const campoDescricao = document.getElementById('CampoDescricao');
  const campoPreco = document.getElementById('CampoPreco');
  const campoImagem = document.getElementById('CampoImagem');

  const titulo = campoTitulo.value.trim();
  const descricao = campoDescricao.value.trim();
  const preco = campoPreco.value.trim();
  const imagem = campoImagem.value.trim();

  // Validação simples dos campos obrigatórios
  if (!titulo) {
    mostrarSnackBar('Por favor, preencha o título do item.');
    campoTitulo.focus();
    return;
  }

  if (!descricao) {
    mostrarSnackBar('Por favor, preencha a descrição do item.');
    campoDescricao.focus();
    return;
  }

  // Formata a data e hora atual em Português (PT-BR)
  const agora = new Date();
  const dataFormatada = agora.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Cria o novo objeto no padrão Data Schema (ItemModel)
  const novoItem = {
    id: Date.now().toString(),
    titulo,
    descricao,
    preco,
    imagem,
    criadoEm: dataFormatada
  };

  // Adiciona no início da lista para aparecer logo no topo da Home
  const listaAtual = carregarItens();
  listaAtual.unshift(novoItem);
  salvarItens(listaAtual);

  // Limpa o formulário e o campo de busca
  document.getElementById('form-cadastro').reset();
  const campoBusca = document.getElementById('campo-busca');
  if (campoBusca) campoBusca.value = '';

  // Atualiza a lista, volta para a Home e confirma com a SnackBar
  renderizarLista('');
  mostrarTela('home');
  mostrarSnackBar('Item cadastrado com sucesso!');
}

/**
 * Remove um item pelo seu ID após confirmação do usuário.
 * @param {string} id
 */
function excluirItem(id) {
  const confirmou = window.confirm('Tem certeza que deseja excluir este item?');
  if (!confirmou) return;

  const listaAtual = carregarItens();
  const novaLista = listaAtual.filter((item) => item.id !== id);
  salvarItens(novaLista);

  fecharDetalhes();

  // Mantém o termo atual da busca ao re-renderizar
  const campoBusca = document.getElementById('campo-busca');
  const termoAtual = campoBusca ? campoBusca.value : '';
  renderizarLista(termoAtual);

  mostrarSnackBar('Item removido!');
}

/* ==========================================================================
   BLOCO 6: AUTENTICAÇÃO LOCAL E PERFIL DO USUÁRIO (Opção 1 — localStorage)
   Equivalente às ações de Auth Login / Create Account / Logout do FlutterFlow.
   ========================================================================== */

/**
 * Alterna entre as abas "Entrar" e "Criar Conta" na tela de autenticação.
 * @param {'login' | 'registro'} aba
 */
function alternarAbaAuth(aba) {
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');
  const tabLogin = document.getElementById('tab-login');
  const tabRegistro = document.getElementById('tab-registro');

  if (aba === 'registro') {
    formLogin.classList.add('hidden');
    formRegistro.classList.remove('hidden');

    tabRegistro.className = 'py-2 rounded-xl text-xs font-bold bg-white text-tema-primario shadow-sm transition-all';
    tabLogin.className = 'py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 transition-all';

    document.getElementById('RegistroNome').focus();
  } else {
    formRegistro.classList.add('hidden');
    formLogin.classList.remove('hidden');

    tabLogin.className = 'py-2 rounded-xl text-xs font-bold bg-white text-tema-primario shadow-sm transition-all';
    tabRegistro.className = 'py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 transition-all';

    document.getElementById('LoginEmail').focus();
  }
}

/**
 * Verifica se existe um usuário logado e alterna entre a tela de Login e o App.
 */
function verificarAutenticacao() {
  const telaAuth = document.getElementById('tela-auth');
  const appLogado = document.getElementById('app-logado');
  const saudacao = document.getElementById('saudacao-usuario');
  const usuario = obterUsuarioLogado();

  if (usuario) {
    telaAuth.classList.add('hidden');
    appLogado.classList.remove('hidden');

    const primeiroNome = (usuario.nome || 'Usuário').trim().split(' ')[0];
    if (saudacao) {
      saudacao.textContent = `Olá, ${primeiroNome} • Turma de Apps`;
    }

    renderizarLista();
    renderizarPerfil();
    mostrarTela('home');
  } else {
    appLogado.classList.add('hidden');
    telaAuth.classList.remove('hidden');
    alternarAbaAuth('login');
  }

  atualizarIcones();
}

/**
 * Valida e-mail e senha no array local de usuários e inicia a sessão.
 * @param {SubmitEvent} evento
 */
function fazerLogin(evento) {
  evento.preventDefault();

  const email = document.getElementById('LoginEmail').value.trim().toLowerCase();
  const senha = document.getElementById('LoginSenha').value;

  if (!email || !senha) {
    mostrarSnackBar('Preencha seu e-mail e sua senha para entrar.');
    return;
  }

  const usuarios = carregarUsuarios();
  const encontrado = usuarios.find(
    (u) => (u.email || '').toLowerCase() === email && u.senha === senha
  );

  if (!encontrado) {
    mostrarSnackBar('E-mail ou senha incorretos. Tente novamente.');
    return;
  }

  salvarUsuarioLogado(encontrado);
  document.getElementById('form-login').reset();
  verificarAutenticacao();

  const primeiroNome = encontrado.nome.trim().split(' ')[0];
  mostrarSnackBar(`Bem-vindo(a), ${primeiroNome}!`);
}

/**
 * Cria uma nova conta de usuário no localStorage e entra automaticamente no app.
 * @param {SubmitEvent} evento
 */
function registrarUsuario(evento) {
  evento.preventDefault();

  const nome = document.getElementById('RegistroNome').value.trim();
  const email = document.getElementById('RegistroEmail').value.trim().toLowerCase();
  const senha = document.getElementById('RegistroSenha').value;
  const bio = document.getElementById('RegistroBio').value.trim();
  const foto = document.getElementById('RegistroFoto').value.trim();

  if (!nome || !email || !senha) {
    mostrarSnackBar('Preencha nome, e-mail e senha para criar sua conta.');
    return;
  }

  if (!email.includes('@')) {
    mostrarSnackBar('Informe um endereço de e-mail válido.');
    return;
  }

  if (senha.length < 4) {
    mostrarSnackBar('A senha precisa ter pelo menos 4 caracteres.');
    return;
  }

  const usuarios = carregarUsuarios();
  const jaExiste = usuarios.some((u) => (u.email || '').toLowerCase() === email);

  if (jaExiste) {
    mostrarSnackBar('Já existe uma conta cadastrada com este e-mail.');
    return;
  }

  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const novoUsuario = {
    id: `user_${Date.now()}`,
    nome,
    email,
    senha,
    bio: bio || 'Usuário do aplicativo PWA IFAP',
    foto,
    criadoEm: `Membro desde ${dataHoje}`
  };

  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);
  salvarUsuarioLogado(novoUsuario);

  document.getElementById('form-registro').reset();
  verificarAutenticacao();
  mostrarSnackBar('Conta criada com sucesso!');
}

/**
 * Preenche a tela de Perfil com os dados do usuário autenticado.
 */
function renderizarPerfil() {
  const usuario = obterUsuarioLogado();
  if (!usuario) return;

  const fotoEl = document.getElementById('perfil-foto');
  const nomeEl = document.getElementById('perfil-nome');
  const emailEl = document.getElementById('perfil-email');
  const bioEl = document.getElementById('perfil-bio');
  const dataEl = document.getElementById('perfil-data');
  const totalItensEl = document.getElementById('perfil-total-itens');

  fotoEl.onerror = function () {
    this.onerror = null;
    this.src = IMAGEM_PADRAO;
  };
  fotoEl.src = obterUrlImagemSegura(usuario.foto);

  nomeEl.textContent = usuario.nome;
  emailEl.textContent = usuario.email;
  bioEl.textContent = usuario.bio || 'Sem descrição informada.';
  dataEl.textContent = usuario.criadoEm || 'Conta ativa';

  const totalItens = carregarItens().length;
  totalItensEl.textContent = totalItens === 1 ? '1 item no app' : `${totalItens} itens no app`;

  // Preenche o formulário de edição com os valores atuais
  document.getElementById('PerfilNome').value = usuario.nome || '';
  document.getElementById('PerfilBio').value = usuario.bio || '';
  document.getElementById('PerfilFoto').value = usuario.foto || '';
}

/**
 * Salva as alterações feitas pelo usuário na aba de Perfil.
 * @param {SubmitEvent} evento
 */
function atualizarPerfil(evento) {
  evento.preventDefault();

  const usuarioAtual = obterUsuarioLogado();
  if (!usuarioAtual) return;

  const novoNome = document.getElementById('PerfilNome').value.trim();
  const novaBio = document.getElementById('PerfilBio').value.trim();
  const novaFoto = document.getElementById('PerfilFoto').value.trim();

  if (!novoNome) {
    mostrarSnackBar('O nome não pode ficar em branco.');
    return;
  }

  const usuarioAtualizado = {
    ...usuarioAtual,
    nome: novoNome,
    bio: novaBio || 'Usuário do aplicativo PWA IFAP',
    foto: novaFoto
  };

  // Atualiza tanto na sessão quanto na lista geral de usuários cadastrados
  salvarUsuarioLogado(usuarioAtualizado);

  const usuarios = carregarUsuarios().map((u) =>
    u.id === usuarioAtualizado.id ? usuarioAtualizado : u
  );
  salvarUsuarios(usuarios);

  const saudacao = document.getElementById('saudacao-usuario');
  if (saudacao) {
    const primeiroNome = novoNome.split(' ')[0];
    saudacao.textContent = `Olá, ${primeiroNome} • Turma de Apps`;
  }

  renderizarPerfil();
  mostrarSnackBar('Perfil atualizado com sucesso!');
}

/**
 * Encerra a sessão do usuário atual e retorna para a tela de Login.
 */
function fazerLogout() {
  const confirmou = window.confirm('Deseja sair da sua conta?');
  if (!confirmou) return;

  localStorage.removeItem(CHAVE_SESSAO);
  fecharDetalhes();
  verificarAutenticacao();
  mostrarSnackBar('Você saiu da conta.');
}

/* ==========================================================================
   BLOCO 7: INICIALIZAÇÃO DO APP E REGISTRO DO PWA (SERVICE WORKER)
   ========================================================================== */

/**
 * Atualiza os ícones SVG do Lucide sem gerar erros caso o usuário esteja offline.
 */
function atualizarIcones() {
  if (typeof window.lucide !== 'undefined' && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/**
 * Registra o Service Worker de forma segura apenas em ambientes suportados
 * (HTTPS no GitHub Pages/Vercel ou localhost durante o desenvolvimento).
 */
function registrarServiceWorker() {
  const ambienteSeguro =
    window.location.protocol === 'https:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  if ('serviceWorker' in navigator && ambienteSeguro) {
    navigator.serviceWorker
      .register('./sw.js')
      .catch((erro) => {
        console.warn('Registro do Service Worker ignorado:', erro);
      });
  }
}

/**
 * Ponto de entrada: executa assim que o HTML terminar de carregar.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Garante que a conta de demonstração exista no primeiro acesso
  carregarUsuarios();

  // 1. Conecta os formulários de Autenticação e Perfil
  const formLogin = document.getElementById('form-login');
  if (formLogin) formLogin.addEventListener('submit', fazerLogin);

  const formRegistro = document.getElementById('form-registro');
  if (formRegistro) formRegistro.addEventListener('submit', registrarUsuario);

  const formPerfil = document.getElementById('form-perfil');
  if (formPerfil) formPerfil.addEventListener('submit', atualizarPerfil);

  // 2. Conecta o envio do formulário de itens à função cadastrarItem()
  const formulario = document.getElementById('form-cadastro');
  if (formulario) {
    formulario.addEventListener('submit', cadastrarItem);
  }

  // 3. Conecta o campo de busca para filtrar os cards em tempo real
  const campoBusca = document.getElementById('campo-busca');
  if (campoBusca) {
    campoBusca.addEventListener('input', (evento) => {
      renderizarLista(evento.target.value);
    });
  }

  // 4. Fecha o modal ao clicar fora da caixa branca (no fundo escuro)
  const modalDetalhes = document.getElementById('modal-detalhes');
  if (modalDetalhes) {
    modalDetalhes.addEventListener('click', (evento) => {
      if (evento.target === modalDetalhes) {
        fecharDetalhes();
      }
    });
  }

  // 5. Fecha o modal ao pressionar a tecla ESC no teclado
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
      fecharDetalhes();
    }
  });

  // 6. Verifica se já existe usuário logado, ativa ícones e registra o PWA
  verificarAutenticacao();
  registrarServiceWorker();
});
