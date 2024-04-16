importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

workbox.loadModule('workbox-background-sync');

workbox.precaching.precacheAndRoute( self.__WB_MANIFEST ); 

const { registerRoute } = workbox.routing; //rutas
const { CacheFirst, NetworkFirst, NetworkOnly } = workbox.strategies; //Estrategias de cache
const { BackgroundSyncPlugin } = workbox.backgroundSync; // Para hacer posteos sin conexion

const cacheNetworkFirst = [
    '/api/auth/renew',
    '/api/events',
]

registerRoute( //optimización de lo de abajo
    ({ request, url }) => {
        // console.log({request, url})
        if ( cacheNetworkFirst.includes( url.pathname ) ) return true
        return false;
    },
    new NetworkFirst()
)

// Referencia
// registerRoute(
//     new RegExp('http://localhost:4000/api/auth/renew'),
//     new NetworkFirst()
// )

const cacheFirstNetwork = [
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css'
];

registerRoute(
    ({ request, url }) => {
        console.log({url})

        if ( cacheFirstNetwork.includes( url.href ) ) return true        

        return false;
    },
    new CacheFirst()
)

// Posteos Offline 
const bgSyncPlugin = new BackgroundSyncPlugin('posteos-offline', {
    maxRetentionTime: 24 * 60 // Si no tuvo conexión por 1 día borramos la info del cache
});

registerRoute(
    new RegExp('http://localhost:4000/api/events'),
    new NetworkOnly({
        plugins: [ bgSyncPlugin ] //Si estamos offline guarda la info del posteo en cache
    }),
    'POST'
)

registerRoute(
    new RegExp('http://localhost:4000/api/events/'),
    new NetworkOnly({
        plugins: [ bgSyncPlugin ]
    }),
    'DELETE'
)

registerRoute(
    new RegExp('http://localhost:4000/api/events/'),
    new NetworkOnly({
        plugins: [ bgSyncPlugin ]
    }),
    'PUT'
)