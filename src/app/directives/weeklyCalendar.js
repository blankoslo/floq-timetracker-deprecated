import moment from 'moment';

export default function() {

  function buildWeek(start) {
    var weekDays = [];
    var date = start.clone();
    for (var i = 0; i < 7; i++) {
      weekDays.push({
        dayInMonth: date.get('date'),
        nameOfDay: date.format('ddd'),
        date: date.format('YYYY-MM-DD')
      });
      date = date.clone().add(1, 'd');
    }
    return weekDays;
  }

  return {
    controller: ($scope, $rootScope) => {
      $scope.$watch('selected', () => {
        $rootScope.$broadcast('dateChanged', $scope.selected.format('YYYY-MM-DD'));
      });
    },
    link: ($scope) => {
      var weekStart = moment().startOf('isoweek');

      $scope.selected = moment();
      $scope.week = buildWeek(weekStart);


      $scope.getHeader = () => {
          var weekNumber = weekStart.get('week');
          var startDate = weekStart.get('date');
          var endOfWeek = weekStart.clone().endOf("isoweek");
          var endDate = endOfWeek.get('date');
          var year = endOfWeek.format('YYYY');
          var month = () => {
            if (weekStart.isSame(endOfWeek, 'month')) {
              return weekStart.format('MMMM')
            } else {
              return `${weekStart.format('MMMM')}/${endOfWeek.format('MMMM')}`
            }
          }
          return `Uke ${weekNumber} ${startDate} - ${endDate}. ${month()} ${year}`;
      }

      $scope.select = (date) => {
        $scope.selected = moment(date);
      }

      $scope.isSelected = (date) => {
          return moment(date).isSame($scope.selected, 'day');
      }

      $scope.previous = () => {
          weekStart = weekStart.clone().subtract(1, 'w');
          $scope.week = buildWeek(weekStart);
          $scope.selected = weekStart;
          $scope.weekNumber = weekStart.get('week');
      };

      $scope.next = () => {
          weekStart = weekStart.clone().add(1, 'w');
          $scope.week = buildWeek(weekStart);
          $scope.selected = weekStart;
          $scope.weekNumber = weekStart.get('week');
      }
    },
    template: require('../views/weeklyCalendar.html')
  }
}
