export default ($http) => {
  const config = window.config = window.config || {};
  const apiUri = config.apiUri || 'http://localhost:3001';
  return {

    getEmployee(mail) {
      return $http({
        method: 'GET',
        url: `${apiUri}/employee/${mail}`
      });
    },

    getWeeklyEntries(employeeId, date) {
      return $http({
        method: 'GET',
        url: `${apiUri}/entries/week/${employeeId}/${date}`
      });
    },

    getLoggedInUser() {
      return $http({
        method: 'GET',
        url: `${apiUri}/employee`
      });
    },

    getProjects() {
      return $http({
        method: 'GET',
        url: `${apiUri}/projects`
      });
    },

    getEntries(employeeId, date) {
      return $http({
        method: 'GET',
        url: `${apiUri}/entries/${employeeId}/${date}`
      });
    },

    logEntry(customer, project, employeeId, date, minutes) {
      return $http({
        method: 'POST',
        url: `${apiUri}/entries/add`,
        data: {
          customer: customer,
          project: project,
          employee: employeeId,
          date: date,
          minutes: minutes
        }
      });
    }
  };
};
