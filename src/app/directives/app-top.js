export default () => {
  return {
    template: require('../views/app-top.html'),
    controller: ($scope, Auth) => {
      $scope.bg = Auth.getTopImage();
      $scope.$on('userChanged', (event, user) => {
        $scope.employee = user;
      })
    }
  }
}