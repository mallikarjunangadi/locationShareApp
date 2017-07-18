angular.module('myApp', [])

.controller('indexCtrl', function($scope, $http){
	$scope.categoryList = ['apparels', 'books', 'jobs', 'journals', 'news', 'security_service', 'legal_service', 'surgical_equipments']; 
	$scope.item = {};
	
	$scope.encodeImageFileAsURL = function() {
    console.log('entered ngchange()....')
    var filesSelected = document.getElementById("inputFileToLoad").files;
	console.log(filesSelected);
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];
      console.log(fileToLoad); 
      var fileReader = new FileReader();

      fileReader.onload = function(fileLoadedEvent) {
        var srcData = fileLoadedEvent.target.result; // <--- data: base64
        console.log(srcData);
		$scope.item.pimageData = srcData;
		$scope.$apply();
      }
      fileReader.readAsDataURL(fileToLoad);
    }
  }
	
	$scope.addItem = function(item) {
		console.log(item);
		item.OrgId = 'codewhite';
		item.id = (new Date()).getTime();
		var doc2send = item;
        
	   
        var req = {
            method: 'POST',
            //url: "http://192.168.0.13:3000/addItems",
			url: "http://codewhiteapp.azurewebsites.net/addItems",
            data: jQuery.param(doc2send),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        $http(req).success(function(data, status, headers, config) {
            console.log(status);
			$scope.item = {};
        }).error(function(data, status, headers, config) {
            console.log('error ' + status);
        });
	} 
})

/*
.directive('bindFile', [function () {
    return {
        require: "ngModel",
        restrict: 'A',
        link: function ($scope, el, attrs, ngModel) {
            el.bind('change', function (event) {
                ngModel.$setViewValue(event.target.files[0]);
                $scope.$apply();
            });
            
            $scope.$watch(function () {
                return ngModel.$viewValue;
            }, function (value) {
                if (!value) {
                    el.val("");
                }
            });
        }
    };
}]);
*/