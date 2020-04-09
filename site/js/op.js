// getData('http://127.0.0.1:3000/activity').then((something) => { console.log(something)}

var config = {header: {'Content-Type': 'application/x-www-form-urlencoded'}}

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
  $http.get("http://127.0.0.1:3000/activity")
  .then(function(response) {
    $scope.myWelcome = response.data;
  });
});