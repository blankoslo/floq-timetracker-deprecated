export default () => {
  return {
    template: require('../views/employee.html'),
    controller: ($scope) => {
      $scope.$on('userChanged', (event, user) => {
        $scope.employee = user;
      })
    }
  }
}
