angular.module('starter.controller', []).controller('SmsCtrl', ['$scope', '$q', '$cordovaSms', '$state', '$rootScope', function($scope, $q, $cordovaSms, $state, $rootScope) {

    console.log('smsCtrl');
    function getPosition() {
        console.log('entered get position...');
        var deferred = $q.defer();
        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log('entered success');
            $scope.lat = pos.coords.latitude,
            $scope.long = pos.coords.longitude
            deferred.resolve('success');
        }, function(error) {
            deferred.reject('failure');
            console.log('Unable to get location: ' + error.message);
            $rootScope.ShowToast('Unable to get location: ' + error.message);
        }, {
            enableHighAccuracy: true,
            maximumAge: Infinity,
            timeout: 15000
        });
        return deferred.promise;
    }
    function calldialog() {
        document.addEventListener("deviceready", function() {
            cordova.dialogGPS("Your GPS is Disabled, this app needs to be enable to works.", //message
            "Use GPS, with wifi or 3G.", //description
            function(buttonIndex) {
                //callback
                switch (buttonIndex) {
                case 0:
                    break;
                    //cancel
                case 1:
                    break;
                    //user go to configuration
                }
            }, "Please Turn on GPS", //title
            ["Cancel", "Enable"]);
            //buttons
        });
    }
    $scope.sendSMS = function() {
        //  $rootScope.ShowToast("message sent to ");
        console.log($rootScope.recieverNumbers);
        console.log('entered');
        cordova.plugins.diagnostic.isLocationAvailable(function(available) {
            console.log(available);
            console.log("Location is " + (available ? "available" : "not available"));
            if (!available) {
                calldialog();
            }
            if (available) {
                send();
            }
        }, function(error) {
            console.error("The following error occurred: " + error);
        });
    }
    function send() {
        if (!(angular.equals({}, $rootScope.sender)) && $rootScope.sender.name != "" && $rootScope.sender.number != "") {
            console.log('entered inside...');
            document.addEventListener("deviceready", function() {
                var promise = getPosition();
                promise.then(function(res) {
                    var options = {
                        replaceLineBreaks: false,
                        android: {
                            intent: ''
                        }
                    };
                    var textBody = "Emergency, SOS from Dr." + $rootScope.sender.name + " (" + $rootScope.sender.number + ")  longitude: " + $scope.long + ", Lattitude: " + $scope.lat + " " + "\n https://www.google.co.in/maps/@" + $scope.lat + "," + $scope.long + ",15z?hl=en";
                    var totalNum = $rootScope.recieverNumbers.length;
                    $rootScope.recieverNumbers.forEach(function(num) {
                        $cordovaSms.send(num, textBody, options).then(function() {
                            console.log('Success');
                            $rootScope.ShowToast("message sent to " + num);
                            console.log(num);
                        }, function(error) {
                            console.log('Error');
                            $rootScope.ShowToast("message sending failed to " + num);
                        });
                        console.log('entered message sending loop...');
                    })
                }, function(res) {
                    console.log(res);
                })
            }, false);
        } else {
            $rootScope.ShowToast('Please register your name and number in settings');
        }
    }
    $scope.settingsPage = function() {
        console.log('settings function')
        $state.go('settings');
    }
}
]).controller('settingsCtrl', ['$scope', '$cordovaSms', '$state', '$ionicHistory', '$rootScope', function($scope, $cordovaSms, $state, $ionicHistory, $rootScope) {
    $scope.$on('$ionicView.beforeEnter', function() {
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
    })
    $scope.goBack = function() {
        console.log('entered back')
        $ionicHistory.goBack();
    }
    ;

    $scope.saveSender = function() {
        console.log($rootScope.sender);
        localStorage.setItem('senderDetails', JSON.stringify($rootScope.sender));
    }
}
]).controller('hometabCtrl', function($scope, $rootScope, $state) {
    //-------for displaying login page------------------
    var sender = localStorage.getItem('senderDetails');
    console.log(sender);
    if (sender === null || sender === "") {
        console.log('new user');
        $state.go('login');
    } else {
        console.log('old user... already logged in');
    }
    //----------------------------------------------------

    $rootScope.devWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width);
    console.log($rootScope.devWidth);
    $rootScope.menuWidth = 0.90 * $rootScope.devWidth;
    console.log("In homeCtrl");
    $scope.rightItems = [];

    jQuery.getJSON('json/MenuItems.json', function(data) {

        $scope.rightItems = data.MenuItems;
        console.log($scope.rightItems);

    });

    $scope.itemclick = function(obj) {
        console.log("OnClick");
        $state.go(obj.state);
    } 

}).controller('loginCtrl', function($scope, $state, $rootScope) {
    $scope.msgSender = {
        name: "",
        number: ""
    }
    $scope.saveUser = function() {
        if ($scope.msgSender.name != "" && $scope.msgSender.number != "" && $scope.msgSender.number.length == 10 && $rootScope.recieverNumbers.length != 0) {
            $rootScope.sender = $scope.msgSender;
            localStorage.setItem('senderDetails', JSON.stringify($rootScope.sender));
            $state.go('tabs');
        }
    }
})
