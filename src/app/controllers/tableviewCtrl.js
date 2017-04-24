import moment from 'moment';

export default class TableViewCtrl {
  constructor($scope, $rootScope, Api, Auth, Notification) {
    this.MINUTE_INCREMENT = 30;
    this.MINUTE_INCREMENT_FIRST_CLICK = 450;
    let selectedDay = moment().format('YYYY-MM-DD');
    $scope.loading = true;
    $scope.entries = [];
    $scope.entriesById = {};


    function fetchDay(day) {
      const startOfWeek = moment(day).startOf('isoweek').format('YYYY-MM-DD');
      const dayInWeek = moment(day).diff(startOfWeek, 'd');
      Api.getEntries(Auth.getEmployee().id, day).then((entries) => {
        entries.data.map((p) => {
          if ($scope.entriesById[p.id] == null) {
            $scope.entriesById[p.id] = {
              customer: p.customer,
              project: p.project,
              days: [0, 0, 0, 0, 0, 0, 0]
            };
            $scope.entries.push($scope.entriesById[p.id]);
          }
          $scope.entriesById[p.id].days[dayInWeek] = p.minutes / 60;
          return null;
        });
        $scope.loading = false;
      });
    }

    function fetchEntries() {
      if (Auth.getEmployee().id) {
        $scope.entries = [];
        $scope.entriesById = {};
        const startOfWeek = moment(selectedDay).startOf('isoweek').format('YYYY-MM-DD');
        [0, 1, 2, 3, 4, 5, 6].map((i) => {
          const day = moment(startOfWeek).add(i, 'days').format('YYYY-MM-DD');
          fetchDay(day);
          return null;
        });
      }
    }


    $scope.$on('entryUpdated', (event, diff, day) => {
      setTimeout(() => fetchDay(day), 1000);
    });

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

}
