/* ==========================================================================
   SW.JS — SERVICE WORKER LEVE (ESTRATÉGIA NETWORK-FIRST)
   ==========================================================================
   POR QUE NETWORK-FIRST?
   Durante o curso, vocês editam o HTML, CSS e JS com frequência.
   A estratégia Network-First tenta sempre buscar a versão mais nova da rede
   primeiro (mostrando suas alterações na hora) e só recorre ao cache local
   quando o celular estiver completamente sem internet (offline).
   ========================================================================== */

const NOME_CACHE = 'ifap-pwa-cache-v1';

const ARQUIVOS_ESSENCIAIS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './assets/icon.svg'
];

/* 1. Instalação: guarda os arquivos essenciais no cache inicial */
self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches
      .open(NOME_CACHE)
      .then((cache) => cache.addAll(ARQUIVOS_ESSENCIAIS))
      .then(() => self.skipWaiting())
  );
});

/* 2. Ativação: limpa versões antigas de cache se o nome for atualizado */
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nomesCaches) =>
        Promise.all(
          nomesCaches
            .filter((nome) => nome !== NOME_CACHE)
            .map((nome) => caches.delete(nome))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* 3. Interceptação de requisições (Estratégia Network-First) */
self.addEventListener('fetch', (evento) => {
  // Ignora requisições que não sejam GET (ex.: POST) ou extensões do navegador
  if (evento.request.method !== 'GET') return;

  const urlRequisicao = new URL(evento.request.url);
  if (urlRequisicao.origin !== self.location.origin) return;

  evento.respondWith(
    fetch(evento.request)
      .then((respostaDaRede) => {
        // Se a rede respondeu bem, atualiza a cópia no cache em segundo plano
        if (respostaDaRede && respostaDaRede.status === 200) {
          const copia = respostaDaRede.clone();
          caches.open(NOME_CACHE).then((cache) => cache.put(evento.request, copia));
        }
        return respostaDaRede;
      })
      .catch(() => {
        // Sem internet: devolve a cópia salva no cache (ou o index.html)
        return caches.match(evento.request).then((respostaCache) => {
          return respostaCache || caches.match('./index.html');
        });
      })
  );
});
