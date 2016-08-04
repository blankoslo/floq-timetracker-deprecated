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
    $scope.$on('overtimeChanged', (event, endDate, overtime) => {
      const positiveEmojis = ['👏', '🙌', '😸', '💅', '💪', '😎', '🤗', '💥', '🙏', '👑', '💁'];
      const negativeEmojis = ['🙄', '😔', '😩', '👀', '👷', '🙈', '🖕', '😳', '😏', '🙇', '😤'];
      const negativeEmoji = negativeEmojis[Math.floor(Math.random() * negativeEmojis.length)];
      const positiveEmoji = positiveEmojis[Math.floor(Math.random() * positiveEmojis.length)];
      $scope.accumulatedOvertime = overtime;
      $scope.accumulatedOvertimeString = overtime >= 0 ?
      `${overtime} timer i pluss ${positiveEmoji}` : `${- overtime} timer i minus ${negativeEmoji}`;
      $scope.accumulatedOvertimeDate = moment(endDate).format('D. MMMM');
    });
    $scope.$on('entryUpdated', (event, diff) => {
      $scope.accumulatedOvertime += diff / 60;
    });
    $scope.goToThisWeek = () => {
      $rootScope.$broadcast('resetCalendar');
    };
  },
  scope: true
});
