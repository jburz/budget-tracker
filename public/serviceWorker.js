console.log("hit serviceWorker.js");


//service worker update
self.addEventListener('install', event => {
    console.log("hit install");

});

//service worker new install
self.addEventListener('activate', event => {
    console.log("hit activate");
});