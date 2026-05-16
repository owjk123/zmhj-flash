// Service Worker for 造梦江湖1 (ZMHJ) - Mock 4399 API
const CACHE_NAME = 'zmhj-v1';

// 4399 game IDs
const STORE_ID = '3885799f65acec467d97b4923caebaae';
const PAY_ID = '10f73c09b41d9f41e761232f5f322f38';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    const url = event.request.url;
    const method = event.request.method;
    
    // ===== Mock 4399 Save API =====
    
    // get_time - returns current timestamp
    if (url.includes('save.api.4399.com') && url.includes('ac=get_time')) {
        event.respondWith(new Response(
            Math.floor(Date.now() / 1000).toString(),
            { status: 200, headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' } }
        ));
        return;
    }
    
    // getData - load save data
    if (url.includes('save.api.4399.com') && url.includes('ac=getdata')) {
        event.respondWith(new Response(
            JSON.stringify({ state: 'ok', data: null, msg: '' }),
            { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        ));
        return;
    }
    
    // saveData - save game data
    if (url.includes('save.api.4399.com') && url.includes('ac=savedata')) {
        event.respondWith(new Response(
            JSON.stringify({ state: 'ok', msg: 'save success', idx: 0 }),
            { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        ));
        return;
    }
    
    // getList - get save list
    if (url.includes('save.api.4399.com') && url.includes('ac=getlist')) {
        event.respondWith(new Response(
            JSON.stringify({ state: 'ok', data: [], msg: '' }),
            { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        ));
        return;
    }
    
    // All other save.api.4399.com requests
    if (url.includes('save.api.4399.com')) {
        event.respondWith(new Response(
            JSON.stringify({ state: 'ok', data: null, msg: '' }),
            { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        ));
        return;
    }
    
    // ===== Mock 4399 Static Resources =====
    
    // flash_ctrl_version.xml
    if (url.includes('stat.api.4399.com/flash_ctrl_version.xml')) {
        event.respondWith(fetch('./flash_ctrl_version.xml').catch(() =>
            new Response('<?xml version="1.0"?><root></root>',
            { status: 200, headers: { 'Content-Type': 'text/xml' } })
        ));
        return;
    }
    
    // ctrl_mo_v5.swf - 4399 control panel
    if (url.includes('cdn.comment.4399pk.com/control/ctrl_mo_v')) {
        event.respondWith(fetch('./ctrl_mo_v5.swf').catch(() =>
            new Response('', { status: 200, headers: { 'Content-Type': 'application/x-shockwave-flash' } })
        ));
        return;
    }
    
    // A4399dv_base.swf - 4399 ad
    if (url.includes('cdn.comment.4399pk.com/control/A4399dv_base.swf')) {
        event.respondWith(fetch('./A4399dv_base.swf').catch(() =>
            new Response('', { status: 200, headers: { 'Content-Type': 'application/x-shockwave-flash' } })
        ));
        return;
    }
    
    // Loading GIF
    if (url.includes('cdn.comment.4399pk.com/control/zwsf2-3.gif')) {
        event.respondWith(fetch('./zwsf2-3.gif').catch(() =>
            new Response('', { status: 200, headers: { 'Content-Type': 'image/gif' } })
        ));
        return;
    }
    
    // Loading2-1.swf - 4399 loading animation
    if (url.includes('cdn.comment.4399pk.com/control/loading')) {
        event.respondWith(new Response('', { status: 200, headers: { 'Content-Type': 'application/x-shockwave-flash' } }));
        return;
    }
    
    // ===== Block all other 4399 requests =====
    if (url.includes('4399.com') || url.includes('4399pk.com')) {
        event.respondWith(new Response('', { status: 200, headers: { 'Content-Type': 'text/plain' } }));
        return;
    }
    
    // ===== Cache game assets =====
    if (url.includes('/assets/') && method === 'GET') {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache =>
                cache.match(event.request).then(response => {
                    if (response) return response;
                    return fetch(event.request).then(networkResponse => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                })
            ).catch(() => fetch(event.request))
        );
        return;
    }
    
    // Default: pass through
    event.respondWith(fetch(event.request));
});
