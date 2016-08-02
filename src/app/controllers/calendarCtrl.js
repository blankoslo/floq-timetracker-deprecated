import moment from 'moment';

export default class CalendarCtrl {
  constructor($scope, $rootScope, Api, Auth) {
    let weekStart = moment().startOf('isoweek');
    const today = moment();
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

    function fetchHolidaysForWeek() {
      const monday = $scope.week[0].date;
      const friday = $scope.week[4].date;
      Api.getHolidays(monday, friday)
            .then((result) => {
              const holidaysThisWeek = result.data;
              $scope.availableHours = (5 - holidaysThisWeek.length) * 7.5;
              $scope.holidays = [];
              if (holidaysThisWeek.length > 0) {
                const holidayDates = holidaysThisWeek.map(x => x.date);
                $scope.week.forEach((weekday, index) => {
                  if (holidayDates.indexOf(weekday.date) > -1) {
                    $scope.holidays.push(index);
                  }
                });
              }
            });
    }

    function fetchOvertime() {
      if (Auth.getEmployee().id) {
        const displayingCurrentWeek = $scope.week.filter(
          d => d.date === today.format('YYYY-MM-DD')).length > 0;
        const endOfWeek = $scope.week[6].date;
        const endDate = displayingCurrentWeek ? today.format('YYYY-MM-DD') : endOfWeek;
        Api.getAccumulatedOvertime(Auth.getEmployee().id, endDate).then((overtime) => {
          const accumulatedOvertime = overtime.data[0].accumulated_overtime_for_employee;
          $rootScope.$broadcast('overtimeChanged', endDate, accumulatedOvertime);
        });
      }
    }

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

    function refreshViewData() {
      fetchHoursForWeek();
      fetchHolidaysForWeek();
      fetchOvertime();
    }

    $scope.previous = () => {
      weekStart = weekStart.clone().subtract(1, 'w');
      $scope.week = this.buildWeek(weekStart);
      $scope.selected = weekStart;
      $scope.weekNumber = weekStart.get('week');
      refreshViewData();
    };

    $scope.next = () => {
      weekStart = weekStart.clone().add(1, 'w');
      $scope.week = this.buildWeek(weekStart);
      $scope.selected = weekStart;
      $scope.weekNumber = weekStart.get('week');
      refreshViewData();
    };

    $scope.$on('resetCalendar', () => {
      weekStart = moment().startOf('isoweek');
      $scope.selected = moment();
      $scope.week = this.buildWeek(weekStart);
      refreshViewData();
    });

    $scope.$on('userChanged', () => {
      refreshViewData();
    });

    $scope.$on('totalWeeklyHours', (event, hours) => {
      $scope.hours = hours;
    });

    $scope.$on('entryUpdated', (event, diff) => {
      $scope.hours += diff / 60;
    });

    $scope.$on('entryUpdated', (event, minutes, day) => {
      appendTime(day, minutes);
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
