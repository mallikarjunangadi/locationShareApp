angular.module('starter.services', [])
.factory("serverFactory", function($http, $q, $rootScope) {

  /*
    var doc2send = {
        myObj: JSON.stringify(eventsArr[0]),
        uId: $scope.editingObj.eventId
    };
    
    var promise = serverFactory.serverToServer({}, "http://192.168.0.13:3000/getItems");
    // var promise = serverFactory.serverToServer({}, "http://calenderappevents.azurewebsites.net/getItems");
  */

    function serverToServer(doc2send, Url) {
     //   doc2send.OrgId = $rootScope.AppUserInformation.OrgId;
          doc2send.OrgId = 'codewhite' 
      
        var deferred = $q.defer();
        var req = {
            method: 'POST',
            url: Url,
            data: jQuery.param(doc2send),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        $http(req).success(function(data, status, headers, config) {
            deferred.resolve(data);
            console.log(status);
        }).error(function(data, status, headers, config) {
            console.log('error ' + status);
            deferred.reject(data);
        });

        return deferred.promise;
    }

    return {
        serverToServer: serverToServer
    }

})
