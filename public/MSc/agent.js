var page = require('webpage').create();
page.open('http://old.oz.com/p2p/index.html?src=http://localhost:9500/channel/oz/ruv/playlist.m3u8', function () {
    window.setTimeout(function() {
        page.render('video.png');
        phantom.exit();
    }, 20000);
});