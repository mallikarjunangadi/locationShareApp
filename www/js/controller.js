angular.module('starter.controller', []).controller('SmsCtrl', function($scope, $cordovaSms, $state, $rootScope) {
    navigator.geolocation.getCurrentPosition(function(pos) {
        $scope.lat = pos.coords.latitude,
        $scope.long = pos.coords.longitude
    }, function(error) {
        alert('Unable to get location: ' + error.message);
    });
    $scope.sendSMS = function() {
        console.log('entered');
        if (!(angular.equals($rootScope.sender))) {
            document.addEventListener("deviceready", function() {
                console.log($rootScope.recieverNumbers);
               
                var options = {
                    replaceLineBreaks: false,
                    android: {
                        intent: ''
                    }
                };
                var textBody = "Emergency, SOS from Dr." + $rootScope.sender.name + " (" + $rootScope.sender.number + ")  longitude:" + $scope.long + ", Lattitude" + $scope.lat;
                console.log(textBody);
                alert(textBody); 
                $cordovaSms.send('8147731228, 8970014591', textBody, options).then(function() {
                    console.log('Success');
                    alert('message sent');
                }, function(error) {
                    console.log('Error');
                    alert('message not sent');
                });
            }, false);
        }
    }
    $scope.settingsPage = function() {
        console.log('settings function')
        $state.go('settings');
    }
}).controller('settingsCtrl', function($scope, $cordovaSms, $state, $ionicHistory, $rootScope) {
    $scope.goBack = function() {
        console.log('entered back')
        $ionicHistory.goBack();
    }
    ;
    $rootScope.recieverNumbers = [];
    $scope.disableNumberAdd = false;
    if ($rootScope.recieverNumbers.length == 10) {
        $scope.disableNumberAdd = true;
    }
    $rootScope.sender = {
        name: "Mallikarjun Angadi",
        number: "8147731228"
    }
    $scope.reciever = {};
    $scope.addNumber = function() {
        if ($scope.reciever.number) {
            if ($rootScope.recieverNumbers.length < 10) {
                $rootScope.recieverNumbers.push($scope.reciever.number);
            } else {
                $scope.disableNumberAdd = true;
            }
            $scope.reciever = {};
            console.log($rootScope.recieverNumbers);
        }
    }
})
