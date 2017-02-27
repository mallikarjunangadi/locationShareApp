angular.module('starter.controller', []).controller('SmsCtrl', ['$scope', '$q', '$cordovaSms', '$state', '$rootScope', function($scope, $q, $cordovaSms, $state, $rootScope) {
  
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
            alert('Unable to get location: ' + error.message);
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
          $rootScope.ShowToast("message sent to ");
        console.log($rootScope.recieverNumbers);
        console.log('entered');

        cordova.plugins.diagnostic.isLocationAvailable(function(available) {
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
                    var successNums = "";
                    var unSuccessNums = "";
                    var totalNum = $rootScope.recieverNumbers.length;
                    var count = 0;

                    $rootScope.recieverNumbers.forEach(function(num) {
                        count = count + 1;
                        $cordovaSms.send(num, textBody, options).then(function() {
                            console.log('Success');
                            $rootScope.ShowToast("message sent to " +num );
                            console.log(count);
                            console.log(num);
                              
                            if (count == 1) {
                                console.log('message sent successfully...');
                                alert('message sent successfully...');
                            }

                        }, function(error) {
                            console.log('Error');
                            $rootScope.ShowToast("message sending failed to " +num );  
                        });
                        console.log('entered message sending loop...');
                    })
                }, function(res) {
                    console.log(res);
                })
            }, false);
        } else {
            alert('Please register your name and number in settings');
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
        if ($rootScope.recieverNumbers.length == 10) {
            $scope.disableNumberAdd = true;
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
    $scope.disableNumberAdd = false;
    $rootScope.sender = {
        name: "",
        number: ""
    };
    $scope.reciever = {};
    $scope.addNumber = function() {
        console.log($scope.reciever.number)
        if ((angular.isDefined($scope.reciever.number)) && (($scope.reciever.number).toString().length) == 10) {
            if ($rootScope.recieverNumbers.length < 10) {
                if (($rootScope.recieverNumbers.indexOf($scope.reciever.number)) == -1) {
                    $rootScope.recieverNumbers.push($scope.reciever.number);
                }
                if ($rootScope.recieverNumbers.length == 10) {
                    $scope.disableNumberAdd = true;
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
        $rootScope.recieverNumbers.splice(index, 1);
        if ($rootScope.recieverNumbers.length < 10) {
            $scope.disableNumberAdd = false;
        }
        localStorage.setItem('recieverNumbers', JSON.stringify($rootScope.recieverNumbers));
    }
}
])
