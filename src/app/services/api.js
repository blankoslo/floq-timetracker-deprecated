export default function($http) {
  var apiUrl = 'http://localhost:3001';
  return {
    getProjects: function() {
      return $http({
        method: 'GET',
        url: apiUrl + '/projects'
      });
    },

    getEntries: function(employeeId, date) {
      return $http({
        method: 'GET',
        url: apiUrl + '/entries/' + employeeId + '/' + date
      });
    },

    logEntry: function(customer, project, employeeId, date, minutes) {
      return $http({
        method: 'POST',
        url: apiUrl + '/entries/add',
        data: {
          customer: customer,
          project: project,
          employee: employeeId,
          date: date,
          minutes: minutes
        }
      });
    }
  }
}
