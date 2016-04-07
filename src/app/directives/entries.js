import moment from 'moment';

export default function() {

  var controller = ($scope, Api) => {
    var selectedDay = moment().format("YYYY-MM-DD");

    $scope.logHour = (entry) => {
      Api.logEntry(entry.customer, entry.project, 1, selectedDay, 30).then(() => {
        updateEntries();
      });
    };

    $scope.removeHour = (entry) => {
      Api.logEntry(entry.customer, entry.project, 1, selectedDay, -30).then(() => {
        updateEntries();
      });
    }

    $scope.$on('dateChanged', (event, date) => {
      selectedDay = date;
      updateEntries();
    })

    $scope.$on('projectAppended', (event, project) => {
      var id = project.customer+ project.code;
      var exists = false;
      $scope.entries.forEach((entry) => {
        if (entry.id == id) exists = true;
      });

      if (!exists) {
        $scope.entries.push({
          customer: project.customer,
          project: project.code,
          title: project.title,
          time: 0
        })
      } else {
        console.log("Project already exists");
      }
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
