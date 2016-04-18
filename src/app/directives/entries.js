import moment from 'moment';

export default () => {
  const MINUTE_INCREMENT = 30;
  const MINUTE_INCREMENT_FIRST_CLICK = 450;

  const controller = ($scope, $rootScope, Api, Auth) => {
    let selectedDay = moment().format('YYYY-MM-DD');

    function fetchEntries() {
      if (Auth.getEmployee().id) {
        Api.getEntries(Auth.getEmployee().id, selectedDay).then((response) => {
          $scope.entries = response.data[0].projects.map(p =>
              // synthesize some properties for internal bookkeeping
              Object.assign({ logged: p.minutes, hours: p.minutes / 60 }, p));
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
          entry.customer,
          entry.code,
          Auth.getEmployee().id,
          selectedDay,
          logMinutes,
          Auth.getLoggedInUser().id) // FIXME: should be done by the server
        .then(() => {});
    };

    $scope.removeHour = (entry) => {
      entry.logged -= MINUTE_INCREMENT;
      entry.hours = entry.logged / 60;
      $rootScope.$broadcast('dayTotalChange', -MINUTE_INCREMENT, selectedDay);
      Api.logEntry(
          entry.customer,
          entry.code,
          Auth.getEmployee().id,
          selectedDay,
          -MINUTE_INCREMENT,
          Auth.getLoggedInUser().id)
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
              entry.customer,
              entry.code,
              Auth.getEmployee().id,
              selectedDay,
              diff,
              Auth.getLoggedInUser().id)
            .then(() => {
              fetchEntries();
            });
        }
      }
    };

    $scope.$on('dateChanged', (event, date) => {
      selectedDay = date;
      fetchEntries();
    });

    $scope.$on('projectAppended', (event, project) => {
      const id = project.customer + project.code;
      let exists = false;
      $scope.entries.forEach((entry) => {
        if (entry.id === id) exists = true;
      });

      if (!exists) {
        $scope.entries.push({
          customer: project.customer,
          project: project.code,
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
    controller: controller
  };
};
