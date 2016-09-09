import moment from 'moment';

export default () => ({
  template: require('../views/app-top.html'),
  controller: ($scope, $rootScope, Auth) => {
    function generateOvertimeString(overtime) {
      const positiveEmojis = ['👏', '🙌', '😸', '💅', '💪', '😎', '🤗', '💥', '🙏', '👑', '💁'];
      const negativeEmojis = ['🙄', '😔', '😩', '👀', '👷', '🙈', '🖕', '😳', '😏', '🙇', '😤'];
      const negativeEmoji = negativeEmojis[Math.floor(Math.random() * negativeEmojis.length)];
      const positiveEmoji = positiveEmojis[Math.floor(Math.random() * positiveEmojis.length)];
      return overtime >= 0
        ? `${overtime} ${overtime === 1 ? 'time' : 'timer'} i pluss ${positiveEmoji}`
        : `${- overtime} ${overtime === -1 ? 'time' : 'timer'} i minus ${negativeEmoji}`;
    }
    $scope.bg = Auth.getTopImage();
    $scope.$on('userChanged', (event, user) => {
      $scope.employee = user;
    });
    $scope.$on('dateChanged', (event, date) => {
      $scope.month = moment(date).format('MMMM YYYY');
    });
    $scope.$on('overtimeChanged', (event, endDate, overtime) => {
      $scope.accumulatedOvertime = overtime;
      $scope.accumulatedOvertimeString = generateOvertimeString(overtime);
      $scope.accumulatedOvertimeDate = moment(endDate).format('D. MMMM');
    });
    $scope.$on('entryUpdated', (event, diff) => {
      $scope.accumulatedOvertime += diff / 60;
      $scope.accumulatedOvertimeString = generateOvertimeString($scope.accumulatedOvertime);
    });
    $scope.goToThisWeek = () => {
      $rootScope.$broadcast('resetCalendar');
    };
  },
  scope: true
});
