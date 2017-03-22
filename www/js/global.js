angular.module('starter.global', []).controller('globalCtrl', function($rootScope, $ionicHistory, $state, $cordovaToast, $ionicLoading) {

    $rootScope.ShowToast = function(message) {
        if (window.cordova) {
            $cordovaToast.showLongBottom(message).then(function(success) {
                console.log("Toast Success");
            }, function(error) {
                console.log("Toast Failed");
            });
        }
    }
   
    // localStorage.setItem('recieverNumbers', '');
    //localStorage.setItem('senderDetails', '');
    $rootScope.recieverNumbers = [];
    if ($rootScope.recieverNumbers.length == 10) {
        $rootScope.disableNumberAdd = true;
    }

    var sosProfile = localStorage.getItem('sosProfile');
    if (sosProfile == '' || sosProfile == null) {
        localStorage.setItem('sosProfile', '');
    }
    console.log(sosProfile);

    var numbers = localStorage.getItem('recieverNumbers');
    if (numbers == '' || numbers == null) {
        localStorage.setItem('recieverNumbers', '');
        $rootScope.recieverNumbers = [];
    } else {
        $rootScope.recieverNumbers = JSON.parse(numbers);
    }
    console.log($rootScope.recieverNumbers);

    var sender = localStorage.getItem('senderDetails');
    console.log(sender);
    if (sender == '' || sender == null) {
        localStorage.setItem('senderDetails', '');
        $rootScope.sender = {
            name: "",
            number: ""
        };
    } else {
        $rootScope.sender = JSON.parse(sender);
    }
    console.log($rootScope.sender);

    $rootScope.disableNumberAdd = false;

    $rootScope.reciever = {};
    $rootScope.addNumber = function(recieverNum) {
        console.log(recieverNum);
        if ((angular.isDefined(recieverNum)) && ((recieverNum).toString().length) == 10) {
            if ($rootScope.recieverNumbers.length < 10) {
                if (($rootScope.recieverNumbers.indexOf(recieverNum)) == -1) {
                    $rootScope.recieverNumbers.push(recieverNum);
                }
                if ($rootScope.recieverNumbers.length == 10) {
                    $rootScope.disableNumberAdd = true;
                }
            } else {
                $rootScope.disableNumberAdd = true;
            }
            localStorage.setItem('recieverNumbers', JSON.stringify($rootScope.recieverNumbers));
            $rootScope.reciever = {};
            console.log($rootScope.recieverNumbers);
        }
    }

    $rootScope.deleteNumber = function(index) {
        $rootScope.recieverNumbers.splice(index, 1);
        if ($rootScope.recieverNumbers.length < 10) {
            $rootScope.disableNumberAdd = false;
        }
        localStorage.setItem('recieverNumbers', JSON.stringify($rootScope.recieverNumbers));
    }

    $rootScope.pickContact = function() {
        console.log('entered pick contacts...')
        navigator.contacts.pickContact(function(contact) {
            if (contact.phoneNumbers != null && contact.phoneNumbers[0].value != null) {
                var selCont = contact.phoneNumbers[0].value.toString();
                console.log(selCont);
                selCont = selCont.replace("+91", "").replace(/-/g, "").replace(/ /g, "");
                $rootScope.$apply(function() {
                    $rootScope.reciever.number = selCont;
                })
            }
        }, function(err) {
            console.log('Error: ' + err);
        });
    }

    $rootScope.goBack = function() {
        console.log('entered back')
        $ionicHistory.goBack();
    }
    ;
    $rootScope.goBackHome = function() {
        console.log('entered back')
        $state.go('tabs');
    }
    ;

    $rootScope.showDbLoading = function() {
        $ionicLoading.show({
            template: 'Loading...', 
            duration: 6000
        }).then(function() {
            console.log("The loading indicator is now displayed");
        });
    }
    ;
    $rootScope.hideDbLoading = function() {
        $ionicLoading.hide().then(function() {
            console.log("The loading indicator is now hidden");
        });
    }
    ;

    $rootScope.mobileServiceClient = new WindowsAzure.MobileServiceClient('http://codewhiteapp.azurewebsites.net','AAAAJDkTxNQ:APA91bG5-OJmavDwBwJr3miKwgsgrsfKLehmKdO3-UfyUSW9KJjQfy_Y2ZHKTfP9KU3qTbpH4zuC8F_jvaklSHRP8mm6aIqml4WxOQpOHo7RcAPMwBf5UA1_Pwp6j0ZZWJZ1CTTHavh3');
     $rootScope.AvailableChannels = null;
     $rootScope.InitPush = function() {
        // will execute when device is ready, or immediately if the device is already ready.
        console.log("platfromctrl2 ionic.platform.ready function");
        //gcmapp will deprecated from here 
        // gcmapp.Initialize();
        
        pushNotification = PushNotification.init({
            "android": {
                "senderID": "155576419540"
            },
            "ios": {
                "alert": "true",
                "badge": "false",
                "sound": "true"
            },
            "browser": {
                "pushServiceURL": 'https://push.ionic.io/api/v1/push'
            },
            'windows': {}
        });
        console.log(pushNotification);
        pushNotification.on('notification', function(data) {
            // Display the alert message in an alert.
            console.log(data);
            $rootScope.ShowToast(data.message);
            console.log(data.additionalData.docID);
         /*   
            var doc2req = {};
            doc2req.docID = data.additionalData.docID;
            var req = {
                method: 'POST',
                url: "http://chungling.azurewebsites.net/VidGetPostM/",
                data: jQuery.param(doc2req),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            console.log(req.data);
            //  var defer = $q.defer();
            //  $ionicLoading.show({
            //   template: 'Loading...'
            //});
            $http(req).success(function(data, status, headers, config) {
                // alter data if needed
                console.log(data.fetchedNews);
                $rootScope.SaveNewsFeed(data.fetchedNews);
                //gau
            }).error(function(data, status, headers, config) {
                console.log(data);
                //  defer.reject();
            });
         */   
            //
            // pull the data from here
            // Reload the items list.
            // app.Storage.getData();
        
        });


        pushNotification.on('registration', function(data) {
            console.log("registering push notification");
            console.log($rootScope.mobileServiceClient);
            console.log(data);
            //https://edum.azure-mobile.net/
            // Get the native platform of the device.
            var platform = device.platform;
            // Get the handle returned during registration.
            var handle = data.registrationId;
            console.log("push registration id is", data.registrationId);
            // Set the device-specific message template.
            if (platform == 'android' || platform == 'Android') {
                // Template registration.
                var template = "{ \"data\" : {\"title\":\"$(title)\",\"message\":\"$(message)\",\"image\":\"$(image)\",\"channels\":\"$(channels)\",\"docID\":\"$(docID)\",\"additionalData\":\"$(additionalData)\"}}"
                //  var template = '{ "data" : {"message":"$(message)"}}';
                // Register for notifications.
                 
               // $rootScope.mobileServiceClient.push.register(handle, 'myTemplate', template, $rootScope.AvailableChannels).done(registrationSuccess, registrationFailure);
                $rootScope.mobileServiceClient.push.gcm.registerTemplate(handle, 'myTemplate', template, $rootScope.AvailableChannels).done(registrationSuccess, registrationFailure);
                console.log($rootScope.mobileServiceClient);
            } else if (device.platform === 'iOS') {
                // Template registration.
                //var template = '{"aps": {"alert": "$(message)"}}';
                var alertTemplate = "{\"aps\":{\"alert\":\"$(message)\",\"title\":\"$(title)\",\"message\":\"$(message)\",\"image\":\"$(image)\",\"channels\":\"$(channels)\",\"docID\":\"$(docID)\", \"additionalData\":\"$(additionalData)\"}}";
                // Register for notifications.      
                console.log(handle);
                //  mobileServiceClient.push.apns.registerTemplate(handle,
                //     'myTemplate', template, null)
                //  .done(registrationSuccess, registrationFailure);
                $rootScope.mobileServiceClient.push.apns.registerNative(data.registrationId, $rootScope.AvailableChannels).done(registrationSuccess, registrationFailure);
            }
        });

        var registrationSuccess = function() {
            $rootScope.ShowToast("Registered with Server!",false);
        }
        var registrationFailure = function(error) {
            $rootScope.ShowToast("Failed registering with Server", false);
            console.log('Failed registering with Server: ' + error);
        }
    }
})
