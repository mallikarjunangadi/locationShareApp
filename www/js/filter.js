angular.module('starter.filter', [])

.filter('EpochToDate', function(){
    return function(e) {
        console.log(e);
        e = parseInt(e);
        var date = (new Date(e)).toString();
        console.log(date);
        
        return date; 
    }
})