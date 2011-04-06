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

Ti.include('lib/twitter_api.js');

Ti.App.twitterApi = new TwitterApi({
    consumerKey: 'consumerKey',
    consumerSecret: 'consumerSecret'
});
var twitterApi = Ti.App.twitterApi;
twitterApi.init();

var latitude;
var longitude;
function tweet(message) {
    var params = {status: message};
    if (latitude && longitude) {
        params['lat'] = latitude;
        params['long'] = longitude;
    }
    twitterApi.statuses_update(
        {
            onSuccess: function(response) {
                alert('tweet success');
                Ti.API.info(response);
            },
            onError: function(error) {
                Ti.API.error(error);
            },
            parameters: params
        }
    );
}

postButton.addEventListener(
    'click',
    function() {
        if (textArea.value) {
            tweet(textArea.value);
            win.close();
        }
    }
);
win.add(postButton);

var mapView = Titanium.Map.createView(
    {
        width: 320,
        height: 240,
        top: 220,
        mapType: Titanium.Map.STANDARD_TYPE,
        region: {latitude:40.0, longitude:130, latitudeDelta:30, longitudeDelta:30},
        animate:true,
        regionFit: true
    }
);
mapView.hide();
win.add(mapView);

Titanium.Geolocation.purpose = 'Twitter投稿のため';
function setCurrentPosition() {
    Titanium.Geolocation.getCurrentPosition(
        function(e) {
            textArea.blur();
            if (!e.success || e.error) {
                alert('位置情報を取得できませんでした。');
                return;
            }

            latitude = e.coords.latitude; //現在地(緯度)
            longitude = e.coords.longitude; //現在地(経度)

            //地図に表示するピン(現在地)を作成
            var currentPos = Titanium.Map.createAnnotation(
                {
                    latitude: latitude,
                    longitude: longitude,
                    title: "現在地",
                    pincolor: Titanium.Map.ANNOTATION_GREEN,
                    animate: true
                }
            );
            //地図にピンを追加
            mapView.addAnnotation(currentPos);
            //地図を表示
            mapView.show();
            //地図の中心を現在地へ移動
            mapView.setLocation(
                {
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }
            );
        }
    );
}

var locationButton = Ti.UI.createButton(
    {
        top: 170,
        left: 10,
        width: 100,
        height: 44,
        title: 'Location'
    }
);
locationButton.addEventListener(
    'click',
    setCurrentPosition
);
win.add(locationButton);

var imageView = Titanium.UI.createImageView(
    {
        width: 'auto',
        height: 240,
        top: 220
    }
);
imageView.hide();
win.add(imageView);

function uploadToTwitPic(image) {
    var xhr = Ti.Network.createHTTPClient();

    var verifyURL = 'https://api.twitter.com/1/account/verify_credentials.json';
    var params = {
        url: verifyURL,
        method: 'GET'
    };
    var header = twitterApi.oAuthAdapter.createOAuthHeader(params);
    Ti.API.debug(header);

    xhr.onload = function() {
        var res = JSON.parse(this.responseText);
        textArea.value = ( textArea.value || '' ) + ' ' + res.url;
    };
    //xhr.onerror = function(){};

    xhr.open('POST', 'https://api.twitpic.com/2/upload.json');
    xhr.setRequestHeader('X-Verify-Credentials-Authorization', header);
    xhr.setRequestHeader('X-Auth-Service-Provider', verifyURL);

    xhr.send(
        {
            key: '35b84c4ad54ab8a53a8edf105c7756da',
            message: textArea.value,
            media: image
        }
    );
}

function startCamera() {
    Titanium.Media.showCamera(
        {
            success: function(e) {
                var image = e.media;
                imageView.image = image;
                imageView.show();
                uploadToTwitPic(image);
            },
            //cancel: function(){},
            error: function(error) {
                if (error.code == Titanium.Media.NO_CAMERA) {
                    alert('カメラがありません');
                }
            },
            saveToPhotoGallery: true,
            allowEditting: true,
            mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO] //MEDIA_TYPE_PHOTO を指定することにより静止画限定になる。指定しなければ動画が来る可能性あり
        }
    );
}

function selectFromPhotoGallery() {
    Ti.Media.openPhotoGallery(
        {
            success: function(e) {
                var image = e.media;
                imageView.image = image;
                imageView.show();
                uploadToTwitPic(image);
            },
            //error: function(error){},
            //cancel: function(){},
            allowEditting: true,
            mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO] //MEDIA_TYPE_PHOTO を指定することにより静止画限定になる。指定しなければ動画が来る可能性あり
        }
    );
}

var sourceSelect = Titanium.UI.createOptionDialog(
    {
        options: ['撮影する', 'アルバムから選ぶ', 'キャンセル'],
        cancel: 2,
        title: '写真を添付'
    }
);
sourceSelect.addEventListener(
    'click',
    function(e) {
        switch(e.index) {
            case 0:
                startCamera();
                break;
            case 1:
                selectFromPhotoGallery();
                break;
        }
    }
);

var photoButton = Ti.UI.createButton(
    {
        top: 170,
        left: 120,
        width: 80,
        height: 44,
        title: 'Photo'
    }
);

photoButton.addEventListener(
    'click',
    function() {
        sourceSelect.show();
    }
);
win.add(photoButton);

