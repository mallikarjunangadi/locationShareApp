angular.module('starter.controller', []).controller('SmsCtrl', function($scope, $q, $cordovaSms, $state, $rootScope) {
    function getPosition() {
        var deferred = $q.defer();
        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log('entered success');
            $scope.lat = pos.coords.latitude,
            $scope.long = pos.coords.longitude
            deferred.resolve('success');
        }, function(error) {
            deferred.reject('failure');
            alert('Unable to get location: ' + error.message);
        });
        return deferred.promise;
    }
    $scope.sendSMS = function() {
        console.log($rootScope.recieverNumbers);
        console.log('entered');
        if (!(angular.equals({}, $rootScope.sender))) {
            document.addEventListener("deviceready", function() {
                var promise = getPosition();
                promise.then(function(res) {
                    var options = {
                        replaceLineBreaks: false,
                        android: {
                            intent: ''
                        }
                    };
                    console.log($rootScope.recieverNumbers);
                    var textBody = "Emergency, SOS from Dr." + $rootScope.sender.name + " (" + $rootScope.sender.number + ")  longitude: " + $scope.long + ", Lattitude: " + $scope.lat;
                    console.log(textBody);
                    alert(textBody);
                    var msg = "";
                 //   var arr = ['8147731228', '9886379322'];
                    $rootScope.recieverNumbers.forEach(function(num) {
                        $cordovaSms.send(num, textBody, options).then(function() {
                            console.log('Success');
                            //alert('message sent');
                            msg = 'sms sent'
                        }, function(error) {
                            console.log('Error');
                            msg = 'sms not sent'
                            //alert('message not sent');
                        });
                    })
                    alert(msg);
                }, function(res) {
                    console.log(res);
                })
            }, false);
        }
    }
    $scope.settingsPage = function() {
        console.log('settings function')
        $state.go('settings');
    }
}).controller('settingsCtrl', function($scope, $cordovaSms, $state, $ionicHistory, $rootScope) {
    $scope.$on('$ionicView.beforeEnter', function() {
        var numbers = localStorage.getItem('recieverNumbers');
        if (numbers == '' || numbers == null) {
            localStorage.setItem('recieverNumbers', '');
            $rootScope.recieverNumbers = [];
        } else {
            $rootScope.recieverNumbers = JSON.parse(numbers);
        }
        if ($rootScope.recieverNumbers.length == 10) {
            $scope.disableNumberAdd = true;
        }
        console.log($rootScope.recieverNumbers);
        var sender = localStorage.getItem('senderDetails');
        console.log(sender);
        if (sender == '' || sender == null) {
            localStorage.setItem('senderDetails', '');
            $rootScope.sender = {};
        } else {
            $rootScope.sender = JSON.parse(sender);
        }
    })
    $scope.goBack = function() {
        console.log('entered back')
        $ionicHistory.goBack();
    };
    $scope.saveSender = function() {
        console.log($rootScope.sender);
        localStorage.setItem('senderDetails', JSON.stringify($rootScope.sender));
    }
    $scope.disableNumberAdd = false;
    $rootScope.sender = {};
    $scope.reciever = {};
    $scope.addNumber = function() {
        if ($scope.reciever.number) {
            if ($rootScope.recieverNumbers.length < 10) {
                if(($rootScope.recieverNumbers.indexOf($scope.reciever.number)) == -1) {
                  $rootScope.recieverNumbers.push($scope.reciever.number);
                }
            } else {
                $scope.disableNumberAdd = true;
            }
            localStorage.setItem('recieverNumbers', JSON.stringify($rootScope.recieverNumbers));
            $scope.reciever = {};
            console.log($rootScope.recieverNumbers);
        }
    }
    $scope.deleteNumber = function(index) {
        $rootScope.recieverNumbers.splice(index,1);
        if ($rootScope.recieverNumbers.length < 10) {
            $scope.disableNumberAdd = false;
        }
        localStorage.setItem('recieverNumbers', JSON.stringify($rootScope.recieverNumbers));
    }
})
