export default () => {
  return {
    template: require('../views/app-top.html'),
    controller: ($scope, Auth) => {
      $scope.$on('userChanged', (user) => {
        $scope.bg = Auth.getTopImage();
      })
    }
  }
}