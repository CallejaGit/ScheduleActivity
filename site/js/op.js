// getData('http://127.0.0.1:3000/activity').then((something) => { console.log(something)}


// app.use(cors({ origin: true, credentials: true }));
// var config = {header: {'Content-Type': 'application/x-www-form-urlencoded'}}

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
  $http.get("http://127.0.0.1:3000/query?start=0&amount=10")
  .then(function(response) {
    $scope.names = response.data.data;
  });
});