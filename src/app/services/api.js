export default ($http) => {
  const config = window.config = window.config || {};
  const apiUri = config.apiUri || 'http://localhost:3001';
  return {

    getEmployee(mail) {
      return $http({
        method: 'GET',
        url: `${apiUri}/employees?email=ilike.${mail}`,
        headers: {
          Prefer: 'plurality=singular'
        }
      });
    },

    getWeeklyEntries(employeeId, date) {
      return $http({
        method: 'POST',
        url: `${apiUri}/rpc/entries_sums_for_employee`,
        data: {
          employee_id: employeeId,
          start_date: date
        }
      });
    },

    getLoggedInUser() {
      return $http({
        method: 'GET',
        url: `${apiUri}/employees?email=ilike.${window.userEmail}`,
        headers: {
          Prefer: 'plurality=singular'
        }
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
        method: 'POST',
        url: `${apiUri}/rpc/projects_for_employee_for_date`,
        data: {
          employee_id: employeeId,
          date: date
        }
      });
    },

    logEntry(customer, project, employeeId, date, minutes, creator) {
      return $http({
        method: 'POST',
        url: `${apiUri}/time_entry`,
        data: {
          customer: customer,
          project: project,
          employee: employeeId,
          date: date,
          minutes: minutes,
          creator: creator
        }
      });
    }
  };
};
