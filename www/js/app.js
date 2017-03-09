// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controller', 'starter.global', 'starter.services', 'starter.filter', 'ngCordova', 'ion-floating-menu', 'angularMoment']).run(function($ionicPlatform) {
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
    });
}).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/login.html'
    })
    .state('settings', {
        url: '/settings',
        templateUrl: 'templates/settings.html'
    }).state('tabs', {
        url: '/tabs',
        templateUrl: 'templates/tabs.html'
    }).state('tabs.sos', {
        url: '/sostab',
        views: {
            'sos-tab': {
                templateUrl: 'templates/sostab.html'
            }
        }
    }).state('tabs.hometab', {
        url: '/hometab',
        views: {
            'home-tab': {
                templateUrl: 'templates/hometab.html'
            }
        }

    }).state('tabs.moretab', {
        url: '/moretab',
        views: {
            'more-tab': {
                templateUrl: 'templates/moretab.html'
            }
        }

    }).state('tabs.profiletab', {
        url: '/profiletab',
        views: {
            'profile-tab': {
                templateUrl: 'templates/profiletab.html'
            }
        }

    }).state('apparels', {
        url: '/apparels',
        templateUrl: 'templates/apparels.html'
    }).state('apparelView', {
        url: '/apparelView',
        templateUrl: 'templates/apparelView.html'
    }).state('books', {
        url: '/books',
        templateUrl: 'templates/books.html'
    }).state('bookView', {
        url: '/bookView',
        templateUrl: 'templates/bookView.html'
    }).state('jobs', {
        url: '/jobs',
        templateUrl: 'templates/job.html'
    }).state('jobView', {
        url: '/jobView',
        templateUrl: 'templates/jobView.html'
    }).state('journals', {
        url: '/journals',
        templateUrl: 'templates/journals.html'
    }).state('journalsView', {
        url: '/journalsView',
        templateUrl: 'templates/journalView.html'
    }).state('newsfeed', {
        url: '/newsfeed',
        templateUrl: 'templates/newsfeed.html'
    }).state('newsfeedView', {
        url: '/newsfeedView',
        templateUrl: 'templates/newsfeedView.html'
    }).state('security', {
        url: '/security',
        templateUrl: 'templates/security.html'
    }).state('securityView', {
        url: '/securityView',
        templateUrl: 'templates/securityView.html'
    }).state('legal', {
        url: '/legal',
        templateUrl: 'templates/legal.html'
    }).state('legalView', {
        url: '/legalView',
        templateUrl: 'templates/legalView.html'
    }).state('surgical', {
        url: '/surgical',
        templateUrl: 'templates/surgical.html'
    }).state('surgicalView', {
        url: '/surgicalView',
        templateUrl: 'templates/surgicalView.html'
    }).state('editProfile', {
        url: '/editProfile',
        templateUrl: 'templates/editProfile.html'
    })
    
    $urlRouterProvider.otherwise('/tabs');
})

 moment.locale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "%d sec",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
})