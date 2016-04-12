import moment from 'moment';

export default () => ({
  template: require('../views/app-top.html'),
  controller: ($scope, $rootScope, Auth) => {
    $scope.bg = Auth.getTopImage();
    $scope.$on('userChanged', (event, user) => {
      $scope.employee = user;
    });
    $scope.$on('dateChanged', (event, date) => {
      $scope.month = moment(date).format('MMMM YYYY');
    });

    $scope.goToThisWeek = () => {
      $rootScope.$broadcast('resetCalendar');
    };
  }
});
