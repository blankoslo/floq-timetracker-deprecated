import moment from 'moment';

export default class TableViewCtrl {
  constructor($scope, $rootScope, Api, Auth) {
    this.MINUTE_INCREMENT = 30;
    this.MINUTE_INCREMENT_FIRST_CLICK = 450;
    let selectedDay = moment().format('YYYY-MM-DD');
    $scope.loading = true;
    $scope.entries = [];
    $scope.entriesById = {};

    function sumPerDay(day) {
      function vectorAdd(arr1, arr2) {
        return arr1.map((elem, index) => elem + arr2[index]);
      }

      const keys = Object.keys($scope.entriesById);
      const weeks = keys.map(id => $scope.entriesById[id]).map(entry => entry.days);

      const sum = weeks.reduce(vectorAdd, [0, 0, 0, 0, 0, 0, 0]);
      return sum[day];
    }

    function weekSum() {
      return $scope.entries.map(entry =>
        entry.days.reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);
    }

    function fetchDay(day) {
      const startOfWeek = moment(day).startOf('isoweek').format('YYYY-MM-DD');
      const dayInWeek = moment(day).diff(startOfWeek, 'd');
      Api.getEntries(Auth.getEmployee().id, day).then((entries) => {
        entries.data.map((p) => {
          if ($scope.entriesById[p.id] == null) {
            $scope.entriesById[p.id] = {
              customer: p.customer,
              project: p.project,
              days: [0, 0, 0, 0, 0, 0, 0],
              sum: 0
            };
            $scope.entries.push($scope.entriesById[p.id]);
          }
          $scope.entriesById[p.id].days[dayInWeek] = p.minutes / 60;
          $scope.entriesById[p.id].sum = $scope.entriesById[p.id].days.reduce((a, b) => a + b, 0);
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

    $scope.sumPerDay = sumPerDay;
    $scope.weekSum = weekSum;

    $scope.$on('entryUpdated', (event, diff, day) => {
      setTimeout(() => fetchDay(day), 1000);
    });

    $scope.$on('weekChanged', (event, date) => {
      selectedDay = date;
      fetchEntries();
    });

    $scope.$on('userChanged', () => {
      fetchEntries();
    });
  }
}
