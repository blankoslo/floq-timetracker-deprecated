import moment from 'moment';

export default class CalendarCtrl {
  constructor($scope, $rootScope, Api, Auth) {
    let weekStart = moment().startOf('isoweek');
    $scope.loading = true;

    function appendTime(date, time) {
      $scope.week.forEach((day) => {
        if (moment(date).isSame(day.date, 'day')) {
          day.logged = parseInt(day.logged) + time;
        }
      });
    }

    function appendWeeklyLog(hours) {
      hours.forEach((e) => {
        appendTime(e.date, e.sum);
      });
    }

    function fetchHoursForWeek() {
      $scope.loading = true;
      Api.getWeeklyEntries(Auth.getEmployee().id, weekStart.format('YYYY-MM-DD'))
        .then((result) => {
          appendWeeklyLog(result.data);
          let totalWeeklyHours = 0;
          result.data.forEach((e) => {
            totalWeeklyHours += (e.sum / 60);
          });
          $rootScope.$broadcast('totalWeeklyHours', totalWeeklyHours);
          $scope.loading = false;
        });
    }

    $scope.selected = moment();
    $scope.week = this.buildWeek(weekStart);

    $scope.displayWeek = () => {
      const weekNumber = weekStart.get('week');
      const weekEnd = weekStart.clone().add(6, 'day');
      const dateStr = () => {
        if (weekStart.month() === weekEnd.month()) {
          return `${weekStart.format('D')}.–${weekEnd.format('D')}. ${weekEnd.format('MMMM')}`;
        }
        return `${weekStart.format('D')}.
                    ${weekStart.format('MMM')} –
                    ${weekEnd.format('D')}.
                    ${weekEnd.format('MMM')}`;
      };

      return `${dateStr()} (uke ${weekNumber})`;
    };

    $scope.select = (date) => {
      $scope.selected = moment(date);
    };

    $scope.isSelected = (date) => moment(date).isSame($scope.selected, 'day');

    $scope.previous = () => {
      weekStart = weekStart.clone().subtract(1, 'w');
      $scope.week = this.buildWeek(weekStart);
      $scope.selected = weekStart;
      $scope.weekNumber = weekStart.get('week');
      fetchHoursForWeek();
    };

    $scope.next = () => {
      weekStart = weekStart.clone().add(1, 'w');
      $scope.week = this.buildWeek(weekStart);
      $scope.selected = weekStart;
      $scope.weekNumber = weekStart.get('week');
      fetchHoursForWeek();
    };

    $scope.$on('userChanged', () => {
      fetchHoursForWeek();
    });

    $scope.$on('entryUpdated', (event, minutes, day) => {
      appendTime(day, minutes);
    });

    $scope.$on('resetCalendar', () => {
      weekStart = moment().startOf('isoweek');
      $scope.selected = moment();
      $scope.week = this.buildWeek(weekStart);
      fetchHoursForWeek();
    });

    $scope.$watch('selected', () => {
      $rootScope.$broadcast('dateChanged', $scope.selected.format('YYYY-MM-DD'));
    });
  }

  buildWeek(start) {
    const weekDays = [];
    let date = start.clone();
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
}
