self.addEventListener('install',function(e){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(clients.claim())});

self.addEventListener('fetch',function(event){
  var url=event.request.url;
  if(url.indexOf('dl.html')===-1)return;
  if(url.indexOf('popup=1')!==-1)return;

  // Read ?f=FILENAME from URL
  var fname='';
  try{fname=new URL(url).searchParams.get('f')||''}catch(e){}
  if(!fname)return; // No ?f= param → EPUB mode, don't interfere

  event.respondWith(
    caches.open('dl-done').then(function(cache){
      return cache.match('done-'+fname).then(function(cached){
        if(cached){
          // ALREADY DONE → return instant back/close (no network request!)
          return new Response(
            '<html><head><script>'+
            'if(history.length>2){history.back()}'+
            'else{try{window.close()}catch(e){}}'+
            'setTimeout(function(){try{window.close();document.documentElement.innerHTML=""}catch(e){}},100)'+
            '</script></head><body></body></html>',
            {headers:{'Content-Type':'text/html'},status:200}
          );
        }
        // NOT DONE → let request through normally
        return fetch(event.request);
      });
    })
  );
});
