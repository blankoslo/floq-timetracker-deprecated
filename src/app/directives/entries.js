import moment from 'moment';

export default () => {
  const MINUTE_INCREMENT = 30;
  const MINUTE_INCREMENT_FIRST_CLICK = 450;
  const DELAY_BEFORE_LOADING_SPINNER = 200;

  const controller = ($scope, $rootScope, $timeout, Api, Auth, Notification) => {
    let selectedDay = moment().format('YYYY-MM-DD');
    $scope.loading = true;

    function fetchEntries() {
      const delayedLoading = $timeout(() => {
        $scope.loading = true;
      }, DELAY_BEFORE_LOADING_SPINNER);
      if (Auth.getEmployee().id) {
        Api.getEntries(Auth.getEmployee().id, selectedDay).then((entries) => {
          $scope.entries = entries.data.map(p =>
            // synthesize some properties for internal bookkeeping
            Object.assign({
              logged: p.minutes,
              hours: p.minutes / 60
            }, p));
          $timeout.cancel(delayedLoading);
          $scope.loading = false;
        });
      }
    }

    $scope.logHour = (entry) => {
      let logMinutes = 0;
      if (entry.logged === 0) {
        entry.logged = MINUTE_INCREMENT_FIRST_CLICK;
        logMinutes = MINUTE_INCREMENT_FIRST_CLICK;
      } else {
        logMinutes = MINUTE_INCREMENT;
        entry.logged += MINUTE_INCREMENT;
      }
      entry.hours = entry.logged / 60;
      $rootScope.$broadcast('dayTotalChange', logMinutes, selectedDay);
      Api.logEntry(
          entry.id,
          Auth.getEmployee().id,
          selectedDay,
          logMinutes)
        .then(() => {});
    };

    $scope.removeHour = (entry) => {
      entry.logged -= MINUTE_INCREMENT;
      entry.hours = entry.logged / 60;
      $rootScope.$broadcast('dayTotalChange', -MINUTE_INCREMENT, selectedDay);
      Api.logEntry(
          entry.id,
          Auth.getEmployee().id,
          selectedDay, -MINUTE_INCREMENT)
        .then(() => {});
    };

    $scope.updateEntry = (entry) => {
      if (entry.hours) {
        const input = entry.hours.replace(/,/g, '.') * 60;
        const logged = entry.logged;
        const diff = input - logged;
        if (diff !== 0) {
          $rootScope.$broadcast('dayTotalChange', diff, selectedDay);
          Api.logEntry(
              entry.id,
              Auth.getEmployee().id,
              selectedDay,
              diff)
            .then(() => {
              fetchEntries();
            });
        }
      }
    };

    $scope.$on('dateChanged', (event, date) => {
      selectedDay = date;
      $scope.header = moment(date).format('dddd D MMMM YYYY');
      fetchEntries();
    });

    $scope.$on('projectAppended', (event, project) => {
      const id = project.id;
      let exists = false;
      $scope.entries.forEach((entry) => {
        if (entry.id === id) exists = true;
      });

      if (!exists) {
        $scope.entries.push({
          id: project.id,
          customer: project.customer,
          project: project.project,
          title: project.title,
          logged: 0,
          hours: 0
        });
      } else {
        Notification.error('Prosjekt finnes allerede', 2000);
      }
    });

    $scope.$on('userChanged', () => {
      fetchEntries();
    });
  };

  return {
    template: require('../views/entries.html'),
    controller: controller,
    scope: true
  };
};
