angular.module('starter.controller', []).controller('SmsCtrl', ['$scope', '$q', '$cordovaSms', '$state', '$rootScope', function($scope, $q, $cordovaSms, $state, $rootScope) {

    console.log('smsCtrl');
    function getPosition() {
        console.log('entered get position...');
        var deferred = $q.defer();
        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log('entered geolocation success');
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

    /*   
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
  */

    $scope.sendSMS = function() {
        //  $rootScope.ShowToast("message sent to ");
        console.log($rootScope.recieverNumbers);
        console.log($rootScope.sender);

        if ($rootScope.sender.name != "" && $rootScope.sender.number != "") {
            console.log('entered inside if condition...');
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
                    var count = 0;
                    $rootScope.recieverNumbers.forEach(function(num) {
                        count++;
                        if (count == 1) {
                            console.log('entered message sending loop...');
                            $rootScope.ShowToast("wait.. message is sending..");
                        }

                        $cordovaSms.send(num, textBody, options).then(function() {
                            console.log('Success');
                            $rootScope.ShowToast("message sent to " + num);
                            console.log(num);
                        }, function(error) {
                            console.log('Error');
                            $rootScope.ShowToast("message sending failed to " + num);
                        });

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
        console.log("home menu button Click");
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
}).controller('profileCtrl', function($scope, $state) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        console.log("ProfileTabCtrl before enter ");
        var sosProfile = localStorage.getItem('sosProfile');
        $scope.profile = JSON.parse(sosProfile);
        console.log($scope.profile);
    });

    /*
    $scope.profileObj = {};
    jQuery.getJSON('json/profile.json', function(data) {
        $scope.profileObj = data;
        console.log($scope.profileObj);    
    });
  */

    $scope.editProfile = function() {
        console.log('edit profile entered');
        $state.go('editProfile');
    }

}).controller("editProfileCtrl", function($scope, $state, $rootScope, $ionicPopover, $cordovaCamera, $cordovaFile) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        console.log("editProfileCtrl before enter ");
        var sosProfile = localStorage.getItem('sosProfile');
        if (sosProfile == '' || sosProfile == null) {
            localStorage.setItem('sosProfile', '');
            $scope.profile = {
                gender: "male",
                profilePic: "img/profilePic.jpg"
            };
        } else {
            $scope.profile = JSON.parse(sosProfile);
        }
        console.log($scope.profile);
    });

    $scope.updateProfile = function(profile) {
        console.log(profile);
        localStorage.setItem('sosProfile', JSON.stringify(profile));
        /*   if(angular.isDefined(profile.dob)) {
          profile.dob =  profile.dob.toString().substr(0,10);
          console.log(profile.dob);
        }
     */
        $state.go('tabs.profiletab');
    }

    var template = '<ion-popover-view class="profilePicPopover"><ion-header-bar> <h1 class="title">Select Profile Picture</h1> </ion-header-bar> <ion-content><button class="button button-positive" ng-click="openCamera()">Camera</button><button class="button button-positive" ng-click="openGallery()">Gallery</button></ion-content></ion-popover-view>'

    $scope.ProfilePicPopover = $ionicPopover.fromTemplate(template, {
        scope: $scope
    });

    $scope.openProfilePicPopover = function($event) {
        $scope.ProfilePicPopover.show($event);
    }
    ;

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.ProfilePicPopover.remove();
    });

    $scope.openCamera = function() {
        $scope.ProfilePicPopover.hide();
        console.log('camera opened..');
        document.addEventListener("deviceready", function() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1020,
                targetHeight: 768,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };
            $cordovaCamera.getPicture(options).then(function(sourcePath) {
                var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
                var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
                // $scope.cameraFileName = cordova.file.dataDirectory + sourceFileName;
                console.log("Copying from : " + sourceDirectory + sourceFileName);
                console.log("Copying to : " + cordova.file.dataDirectory + sourceFileName);
                $cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, sourceFileName).then(function(success) {
                    $scope.cameraFileName = cordova.file.dataDirectory + sourceFileName;
                    console.log($scope.cameraFileName);
                    $scope.profile.profilePic = $scope.cameraFileName;
                }, function(error) {
                    console.dir(error);
                });
            }, function(err) {// error
            });
        }, false);
    }
    $scope.openGallery = function() {
        $scope.ProfilePicPopover.hide();
        console.log('gallery opened..');
        document.addEventListener("deviceready", function() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true
            };
            $cordovaCamera.getPicture(options).then(function(sourcePath) {
                var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
                var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
                var destinationTypeFileName = (new Date()).getTime() + '.jpg';
                // $scope.cameraFileName = cordova.file.dataDirectory + sourceFileName;
                console.log("Copying from : " + sourceDirectory + sourceFileName);
                console.log("Copying to : " + cordova.file.dataDirectory + destinationTypeFileName);
                console.log(sourceFileName);
                console.log($scope.galeryFileName);
                $cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, destinationTypeFileName).then(function(success) {
                    $scope.galleryFileName = cordova.file.dataDirectory + destinationTypeFileName;
                    console.log($scope.galleryFileName);
                    $scope.profile.profilePic = $scope.galleryFileName;
                }, function(error) {
                    console.dir(error);
                });
            }, function(err) {
                console.log(err);
            });
        }, false);
    }

    $scope.goToProfile = function() {
        console.log('got to profile tab..')
        $state.go('tabs.profiletab');
    }
}).controller('apparelsCtrl', function($scope, $rootScope, $state, serverFactory) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        $rootScope.showDbLoading();
        var promise = serverFactory.serverToServer({
            category: "apparels"
        //}, "http://192.168.0.13:3000/getItems");
           }, "http://codewhiteapp.azurewebsites.net/getItems");
        promise.then(function(data) {
            console.log(data);
            $rootScope.hideDbLoading();
            $scope.apparelsItems = data.Data;
        }, function() {
            console.log('Unable to load data');
            $rootScope.hideDbLoading();
        })
    })

    $scope.apparelsItems = [];
    /*   
    jQuery.getJSON('json/apparels.json', function(data) {
        $scope.apparelsItems = data.apparels;
        console.log($scope.apparelsItems);
    });
 */
    $scope.apparelDetails = function(obj) {
        $rootScope.selectedApparel = obj;
        $state.go('apparelView');
    }
}).controller('booksCtrl', function($scope, $rootScope, $state, serverFactory) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        $rootScope.showDbLoading();
        var promise = serverFactory.serverToServer({
            category: "books"
        //}, "http://192.168.0.13:3000/getItems");
        }, "http://codewhiteapp.azurewebsites.net/getItems");
        promise.then(function(data) {
            console.log(data);
            $rootScope.hideDbLoading();
            $scope.booksItems = data.Data;
        }, function() {
            $rootScope.hideDbLoading();
            console.log('Unable load data');
        })
    })

    var t = (new Date()).getTime();
    console.log(t);
    var d = new Date(t);
    console.log(d);

    /*
    $scope.booksItems = [];
    jQuery.getJSON('json/books.json', function(data) {
        $scope.booksItems = data.books;
        console.log($scope.booksItems);
    });
  */
    $scope.booksDetails = function(obj) {
        $rootScope.selectedbook = obj;
        $state.go('bookView');
    }
}).controller('jobsCtrl', function($scope, $rootScope, $state, serverFactory) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        $rootScope.showDbLoading();
        var promise = serverFactory.serverToServer({
            category: "jobs"
       // }, "http://192.168.0.13:3000/getItems");
         }, "http://codewhiteapp.azurewebsites.net/getItems");
        promise.then(function(data) {
            console.log(data);
            $rootScope.hideDbLoading();
            $scope.jobsItems = data.Data;
        }, function() {
            $rootScope.hideDbLoading();
            console.log('Unable load data');
        })
    })
    console.log('entered job ctrl');
    $scope.jobsItems = [];
    /*   
    jQuery.getJSON('json/myjobs.json', function(data) {
        console.log(data);
        $scope.jobsItems = data.jobs;
        console.log($scope.jobsItems);
    });
 */
    $scope.jobDetails = function(obj) {
        $rootScope.selectedjob = obj;
        $state.go('jobView');
    }
}).controller('journalsCtrl', function($scope, $rootScope, $state, serverFactory) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        $rootScope.showDbLoading();
        var promise = serverFactory.serverToServer({
            category: "journals"
       // }, "http://192.168.0.13:3000/getItems");
         }, "http://codewhiteapp.azurewebsites.net/getItems");
        promise.then(function(data) {
            console.log(data);
            $rootScope.hideDbLoading();
            $scope.journalsItems = data.Data;
        }, function() {
            $rootScope.hideDbLoading();
            console.log('Unable load data');
        })
    })
    console.log('entered journals ctrl');
    $scope.journalsItems = [];

    /*  
    jQuery.getJSON('json/journals.json', function(data) {
        console.log(data);
        $scope.journalsItems = data.journals;
        console.log($scope.journalsItems);
    });
  */

    $scope.journalsDetails = function(obj) {
        $rootScope.selectedjournal = obj;
        $state.go('journalsView');
    }
}).controller('newsfeedCtrl', function($scope, $rootScope, $state, serverFactory) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        $rootScope.showDbLoading();
        var promise = serverFactory.serverToServer({
            category: "news"
      //  }, "http://192.168.0.13:3000/getItems");
         }, "http://codewhiteapp.azurewebsites.net/getItems");
        promise.then(function(data) {
            console.log(data);
            $rootScope.hideDbLoading();
            $scope.newsfeedItems = data.Data;
        }, function() {
            $rootScope.hideDbLoading();
            console.log('Unable load data');
        })
    })
    console.log('entered journals ctrl');
    $scope.newsfeedItems = [];

    /* 
    jQuery.getJSON('json/newsfeed.json', function(data) {
        console.log(data);
        $scope.newsfeedItems = data.news;
        console.log($scope.newsfeedItems);
    });
  */
    $scope.newsfeedDetails = function(obj) {
        $rootScope.selectednews = obj;
        $state.go('newsfeedView');
    }
}).controller('securityCtrl', function($scope, $rootScope, $state, serverFactory) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        $rootScope.showDbLoading();
        var promise = serverFactory.serverToServer({
            category: "security_services"
        //}, "http://192.168.0.13:3000/getItems");
         }, "http://codewhiteapp.azurewebsites.net/getItems");

        promise.then(function(data) {
            console.log(data);
            $rootScope.hideDbLoading();
            $scope.securityItems = data.Data;
        }, function() {
            $rootScope.hideDbLoading();
            console.log('Unable load data');
        })
    })
    console.log('entered security ctrl');
    $scope.securityItems = [];

    /*  
    jQuery.getJSON('json/security.json', function(data) {
        console.log(data);
        $scope.securityItems = data.security;
        console.log($scope.securityItems);
    });
   */

    $scope.securityDetails = function(obj) {
        $rootScope.selectedsecurity = obj;
        $state.go('securityView');
    }
}).controller('legalCtrl', function($scope, $rootScope, $state, serverFactory) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        $rootScope.showDbLoading();
        var promise = serverFactory.serverToServer({
            category: "legal_services"
        //}, "http://192.168.0.13:3000/getItems");
         }, "http://codewhiteapp.azurewebsites.net/getItems");
        promise.then(function(data) {
            console.log(data);
            $rootScope.hideDbLoading();
            $scope.legalItems = data.Data;
        }, function() {
            $rootScope.hideDbLoading();
            console.log('Unable load data');
        })
    })
    console.log('entered legal ctrl');
    $scope.legalItems = [];

    /*  
    jQuery.getJSON('json/legal.json', function(data) {
        console.log(data);
        $scope.legalItems = data.legal;
        console.log($scope.legalItems);
    });
 */
    $scope.legalDetails = function(obj) {
        $rootScope.selectedlegal = obj;
        $state.go('legalView');
    }
}).controller('surgicalCtrl', function($scope, $rootScope, $state, serverFactory) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        $rootScope.showDbLoading();
        var promise = serverFactory.serverToServer({
            category: "surgical_services"
       // }, "http://192.168.0.13:3000/getItems");
         }, "http://codewhiteapp.azurewebsites.net/getItems");
        promise.then(function(data) {
            console.log(data);
            $rootScope.hideDbLoading();
            $scope.surgicalItems = data.Data;
        }, function() {
            $rootScope.hideDbLoading();
            console.log('Unable load data');
        })
    })

    console.log('entered surgical ctrl');
    $scope.surgicalItems = [];

    /*  
    jQuery.getJSON('json/surgical.json', function(data) {
        console.log(data);
        $scope.surgicalItems = data.surgical;
        console.log($scope.surgicalItems);
    });
  */

    $scope.surgicalDetails = function(obj) {
        $rootScope.selectedsurgical = obj;
        $state.go('surgicalView');
    }
})
