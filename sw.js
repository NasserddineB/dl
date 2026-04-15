self.addEventListener('install',function(e){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(clients.claim())});
self.addEventListener('fetch',function(event){
  var url=event.request.url;
  if(url.indexOf('dl.html')===-1)return;
  var fname='';
  try{fname=new URL(url).searchParams.get('f')||''}catch(e){}
  if(!fname)return;
  event.respondWith(
    caches.open('dl-done').then(function(cache){
      return cache.match('done-'+fname).then(function(cached){
        if(cached)return new Response(null,{status:204});
        return fetch(event.request);
      });
    }).catch(function(){return fetch(event.request)})
  );
});
