import moment from 'moment';

export default () => {
  function buildWeek(start) {
    var weekDays = [];
    var date = start.clone();
    for (let i = 0; i < 7; i++) {
      weekDays.push({
        dayInMonth: date.get('date'),
        nameOfDay: date.format('ddd'),
        date: date.format('YYYY-MM-DD'),
        logged: 0
      });
      date = date.clone().add(1, 'd');
    }
    return weekDays;
  }

  return {
    controller: ($scope, $rootScope, Api, Auth) => {
      var weekStart = moment().startOf('isoweek');

      $scope.selected = moment();
      $scope.week = buildWeek(weekStart);

      $scope.displayWeek = () => {
        var weekNumber = weekStart.get('week');

        return `Uke ${weekNumber}`;
      };

      $scope.select = (date) => {
        $scope.selected = moment(date);
      };

      $scope.isSelected = (date) => moment(date).isSame($scope.selected, 'day');

      $scope.previous = () => {
        weekStart = weekStart.clone().subtract(1, 'w');
        $scope.week = buildWeek(weekStart);
        $scope.selected = weekStart;
        $scope.weekNumber = weekStart.get('week');
        fetchHoursForWeek();
      };

      $scope.next = () => {
        weekStart = weekStart.clone().add(1, 'w');
        $scope.week = buildWeek(weekStart);
        $scope.selected = weekStart;
        $scope.weekNumber = weekStart.get('week');
        fetchHoursForWeek();
      };

      function fetchHoursForWeek() {
        Api.getWeeklyEntries(Auth.getEmployee().id, weekStart.format('YYYY-MM-DD')).then((result) => {
          appendWeeklyLog(result.data);
        });
      }

      function appendWeeklyLog(hours) {
        hours.forEach((e) => {
          appendTime(e.date, e.sum);
        });
      }

      function appendTime(date, time) {
        $scope.week.forEach((day) => {
          if (moment(date).isSame(day.date, 'day')) {
            day.logged = parseInt(day.logged) + time;
          }
        });
      }

      $scope.$on('userChanged', () => {
        fetchHoursForWeek();
      });

      $scope.$on('dayTotalChange', (event, minutes, day) => {
        appendTime(day, minutes);
      });

      $scope.$on('resetCalendar', () => {
        weekStart = moment().startOf('isoweek');
        $scope.selected = moment();
        $scope.week = buildWeek(weekStart);
        fetchHoursForWeek();
      });

      $scope.$watch('selected', (change) => {
        $rootScope.$broadcast('dateChanged', $scope.selected.format('YYYY-MM-DD'));
      });
    },
    link: ($scope) => {

    },
    template: require('../views/calendar.html')
  };
};
