// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controller', 'ngCordova']).run(function($ionicPlatform, $rootScope, $cordovaToast) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        $rootScope.ShowToast = function(message) {
        if (window.cordova) {

                $cordovaToast.showLongBottom(message).then(function(success) {
                    // success
                    console.log("Toast Success");
                }, function(error) {
                    // error
                    console.log("Toast Failed");
                });
            }
        
    }
        // localStorage.setItem('recieverNumbers', '');
        //localStorage.setItem('senderDetails', '');
        $rootScope.recieverNumbers = [];
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
            $rootScope.sender = {name:"", number:""};
        } else {
            $rootScope.sender = JSON.parse(sender);
        }
    });
}).config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'templates/home.html'
    }).state('settings', {
        url: '/settings',
        templateUrl: 'templates/settings.html'
    })
    $urlRouterProvider.otherwise('/home');
})
