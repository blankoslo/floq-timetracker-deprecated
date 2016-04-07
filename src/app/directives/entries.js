import moment from 'moment';

export default function() {

  var controller = function($scope, Api) {
    var selectedDay = moment().format("YYYY-MM-DD");
    console.log("Day set ", selectedDay);

    $scope.logHour = function(entry) {
      Api.logEntry(entry.customer, entry.project, 1, new Date().toISOString(), 30).then(() => {
        updateEntries();
      });
    };

    $scope.removeHour = function(entry) {
      Api.logEntry(entry.customer, entry.project, 1, new Date().toISOString(), -30).then(() => {
        updateEntries();
      });
    }

    $scope.$on('dateChanged', function(event, date) {
      selectedDay = date;
      updateEntries();
    })

    function updateEntries() {
      Api.getEntries(1, selectedDay).then((response) => {
        $scope.entries = response.data;
      });
    }

    updateEntries();
  }

  return {
    template: require('../views/entries.html'),
    controller: controller
  }
}
