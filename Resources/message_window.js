var win = Ti.UI.currentWindow;
var textArea = Ti.UI.createTextArea(
    {
        height: 150,
        width: 300,
        top: 10,
        font: {fontSize:20},
        borderWidth: 2,
        borderColor: '#bbb',
        borderRadius: 5
    }
);

win.add(textArea);
var postButton = Ti.UI.createButton(
    {
        top: 170,
        right: 10,
        width: 100,
        height: 44,
        title: 'POST'
    }
);
win.add(postButton);

