import moment from 'moment';

export default () => {
  var MINUTE_INCREMENT = 30;
  var MINUTE_INCREMENT_FIRST_CLICK = 450;

  var controller = ($scope, $rootScope, Api, Auth) => {
    var selectedDay = moment().format('YYYY-MM-DD');

    $scope.logHour = (entry) => {
      var logMinutes = 0;
      if (entry.logged === 0) {
        entry.logged = MINUTE_INCREMENT_FIRST_CLICK;
        logMinutes = MINUTE_INCREMENT_FIRST_CLICK;
      } else {
        logMinutes = MINUTE_INCREMENT;
        entry.logged += MINUTE_INCREMENT;
      }
      entry.hours = entry.logged / 60;
      $rootScope.$broadcast('dayTotalChange', logMinutes, selectedDay);
      Api.logEntry(entry.customer, entry.project, Auth.getEmployee().id, selectedDay, logMinutes).then(() => {

      });
    };

    $scope.removeHour = (entry) => {
      entry.logged -= MINUTE_INCREMENT;
      entry.hours = entry.logged / 60;
      $rootScope.$broadcast('dayTotalChange', -MINUTE_INCREMENT, selectedDay);
      Api.logEntry(entry.customer, entry.project, Auth.getEmployee().id, selectedDay, -MINUTE_INCREMENT).then(() => {

      });
    };

    $scope.updateEntry = (entry) => {
      var input = entry.hours.replace(/,/g, '.') * 60;
      var logged = entry.logged;
      var diff = input - logged;
      if (diff !== 0) {
        $rootScope.$broadcast('dayTotalChange', diff, selectedDay);
        Api.logEntry(entry.customer, entry.project, Auth.getEmployee().id, selectedDay, diff).then(() => {
          fetchEntries();
        });
      }
    };

    function fetchEntries() {
      if (Auth.getEmployee().id) {
        Api.getEntries(Auth.getEmployee().id, selectedDay).then((response) => {
          $scope.entries = response.data;
        });
      }
    }

    $scope.$on('dateChanged', (event, date) => {
      selectedDay = date;
      fetchEntries();
    });

    $scope.$on('projectAppended', (event, project) => {
      var id = project.customer + project.code;
      var exists = false;
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
        console.log('Project already exists');
      }
    });

    $scope.$on('userChanged', (user) => {
      fetchEntries();
    });
  };

  return {
    template: require('../views/entries.html'),
    controller: controller
  };
};
