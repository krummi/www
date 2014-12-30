var page = require('webpage').create();
page.open('http://www.dhs.state.il.us/accessibility/tests/flash/video.html', function () {
    window.setTimeout(function(){
        page.render('video.png');
        phantom.exit();
    }, 20000);
});