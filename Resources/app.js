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

var timeline = [{text: 'コメント１'}, {text: 'コメント２'}, {text: 'コメント３'}]; //仮のデータ
var data = [];
for (var i=0; i<timeline.length;i++) {
    var tweet = timeline[i];
    var row = Ti.UI.createTableViewRow();
    var commentLabel = Ti.UI.createLabel();
    commentLabel.text = tweet.text;
    row.add(commentLabel);
    data.push(row);
}
var tableView = Ti.UI.createTableView({
    data:data
});
win1.add(tableView);
win1.hideTabBar();
//
//  add tabs
//
tabGroup.addTab(tab1);  

// open tab group
tabGroup.open();
