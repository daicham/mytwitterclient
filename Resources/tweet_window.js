var win = Ti.UI.currentWindow;

var permalink =
    'http://twitter.com/' + win.screen_name
    + '/status/' + win.status_id;

var webView = Ti.UI.createWebView(
    {
         url: permalink
    }
);
win.add(webView);
