// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    window:win1
});

//画面表示時はまだデータとれていないので(非同期だから)最初は空にしておく
var data = [];
var tableView = Ti.UI.createTableView({
    data:data
});

function updateTimeline (timeline) {
    var currentData = [];
    for (var i=0; i<timeline.length;i++) {
        var tweet = timeline[i];
        var row = Ti.UI.createTableViewRow();
        var commentLabel = Ti.UI.createLabel();
        commentLabel.text = tweet.text;
        row.add(commentLabel);
        currentData.push(row);
    }
    tableView.setData(currentData);
}

var xhr = Ti.Network.createHTTPClient(); //Ti.Network.HTTPClientは非同期で動く
var user = 'daicham';
var url = "http://api.twitter.com/1/statuses/user_timeline.json?screen_name=" + user;
xhr.open('GET', url);
xhr.onload = function() {
    var timeline = JSON.parse(this.responseText);
    updateTimeline(timeline);
};
xhr.send();

win1.add(tableView);
win1.hideTabBar();
//
//  add tabs
//
tabGroup.addTab(tab1);  

// open tab group
tabGroup.open();
