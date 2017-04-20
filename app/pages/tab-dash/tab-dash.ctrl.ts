export class DashCtrl {
  constructor ($scope, $http, $rootScope) {
    $scope.input = {};
    $scope.searchArtist = function(){

      $http.get("http://localhost:3000/search?type=artist", {
        params: {
          q: $scope.input.search
        }
      }).then(function(response){
         $rootScope.items = response.data.artists.items;
      })
    };
  }
};
