angular.module('starter.global', []).controller('globalCtrl', function($rootScope, $ionicHistory, $state) {

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

    $rootScope.disableNumberAdd = false;
    $rootScope.sender = {
        name: "",
        number: ""
    };

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
    };
    $rootScope.goBackHome = function() {
        console.log('entered back')
        $state.go('tabs');
    };
})
