import moment from 'moment';

export default () => {
  return {
    template: require('../views/app-top.html'),
    controller: ($scope, Auth) => {

      $scope.bg = Auth.getTopImage();
      $scope.$on('userChanged', (event, user) => {
        $scope.employee = user;
      })
      $scope.$on('dateChanged', (event, date) => {
        $scope.month = moment(date).format("MMMM YYYY");
      });
    }
  }
}