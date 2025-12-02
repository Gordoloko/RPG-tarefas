// Nome e versão do cache (mude a versão se alterar o app)
const CACHE_NAME = 'rpg-tarefas-cache-v1';
// Lista de arquivos que devem ser salvos offline
const urlsToCache = [
    './',
    './index.html',
    './manifest.json'
    // Adicionar aqui se tiver outros arquivos (CSS ou JS externos)
    // Se você tiver os ícones, adicione:
    // './icon-192.png',
    // './icon-512.png'
];

// Instalação do Service Worker
self.addEventListener('install', function(event) {
    // Espera até que o cache seja aberto e todos os arquivos sejam salvos
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cache aberto e arquivos salvos.');
                return cache.addAll(urlsToCache);
            })
    );
});

// Interceptando Requisições (Para Fornecer Conteúdo Offline)
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Se o arquivo estiver no cache, retorna ele
                if (response) {
                    return response;
                }
                // Se não estiver, faz a requisição normal
                return fetch(event.request);
            })
    );
});

// Atualizando o Cache (Limpando versões antigas)
self.addEventListener('activate', function(event) {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName); // Deleta caches antigos
                    }
                })
            );
        })
    );
});
