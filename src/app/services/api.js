export default ($http) => {
  const config = window.config = window.config || {};
  const apiUrl = config.apiUrl || 'http://localhost:3001';
  return {

    getEmployee(mail) {
      return $http({
        method: 'GET',
        url: `${apiUrl}/employee/${mail}`
      });
    },

    getWeeklyEntries(employeeId, date) {
      return $http({
        method: 'GET',
        url: `${apiUrl}/entries/week/${employeeId}/${date}`
      });
    },

    getLoggedInUser() {
      return $http({
        method: 'GET',
        url: `${apiUrl}/employee`
      });
    },

    getProjects() {
      return $http({
        method: 'GET',
        url: `${apiUrl}/projects`
      });
    },

    getEntries(employeeId, date) {
      return $http({
        method: 'GET',
        url: `${apiUrl}/entries/${employeeId}/${date}`
      });
    },

    logEntry(customer, project, employeeId, date, minutes) {
      return $http({
        method: 'POST',
        url: `${apiUrl}/entries/add`,
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
