import moment from 'moment';

export default class EntriesCtrl {
  constructor($scope, $rootScope, $window, Api, Auth, Notification) {
    this.MINUTE_INCREMENT = 30;
    this.MINUTE_INCREMENT_FIRST_CLICK = 450;
    let selectedDay = moment().format('YYYY-MM-DD');
    $scope.loading = true;

    function handleLogError() {
      $window.alert('Noe gikk galt under lagringen av timene. Last inn siden på nytt.');
    }

    function fetchEntries() {
      if (Auth.getEmployee().id) {
        Api.getEntries(Auth.getEmployee().id, selectedDay).then((entries) => {
          $scope.entries = entries.data.map(p =>
            // synthesize some properties for internal bookkeeping
            Object.assign({
              logged: p.minutes,
              hours: p.minutes / 60
            }, p));
          $scope.loading = false;
        });
      }
    }

    $scope.logHour = (entry) => {
      const change = this.calculateChange(entry.logged, true);
      entry.logged = change.logged;
      entry.hours = change.hours;
      $rootScope.$broadcast('entryUpdated', change.change, selectedDay);
      Api.logEntry(
          entry.id,
          Auth.getEmployee().id,
          selectedDay,
          change.change)
          .then(() => {}, handleLogError);
    };

    $scope.removeHour = (entry) => {
      const change = this.calculateChange(entry.logged, false);
      entry.logged = change.logged;
      entry.hours = change.hours;
      $rootScope.$broadcast('entryUpdated', change.change, selectedDay);
      Api.logEntry(
          entry.id,
          Auth.getEmployee().id,
          selectedDay,
          change.change)
          .then(() => {}, handleLogError);
    };

    $scope.updateEntry = (entry) => {
      if (entry.hours) {
        const input = entry.hours.replace(/,/g, '.') * 60;
        const logged = entry.logged;
        const diff = input - logged;
        if (diff !== 0) {
          $rootScope.$broadcast('entryUpdated', diff, selectedDay);
          Api.logEntry(
              entry.id,
              Auth.getEmployee().id,
              selectedDay,
              diff)
            .then(() => { fetchEntries(); }, handleLogError);
        }
      }
    };

    $scope.$on('dateChanged', (event, date) => {
      selectedDay = date;
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
          customer: project.customer.name,
          project: project.name,
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
  }

  calculateChange(logged, increase) {
    const result = {
      change: 0,
      logged: 0,
      hours: 0
    };

    if (!increase) {
      if (logged === 0) {
        result.change = this.MINUTE_INCREMENT_FIRST_CLICK;
        result.logged = this.MINUTE_INCREMENT_FIRST_CLICK;
        result.hours = this.MINUTE_INCREMENT_FIRST_CLICK / 60;
      } else {
        result.change = -this.MINUTE_INCREMENT;
        result.logged = logged - this.MINUTE_INCREMENT;
        result.hours = (logged - this.MINUTE_INCREMENT) / 60;
      }
    } else {
      result.change = this.MINUTE_INCREMENT;
      result.logged = logged + this.MINUTE_INCREMENT;
      result.hours = (logged + this.MINUTE_INCREMENT) / 60;
    }

    return result;
  }
}
