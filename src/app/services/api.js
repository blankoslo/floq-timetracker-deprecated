export default ($http) => {
  const config = window.config = window.config || {};
  const apiUri = config.apiUri || 'http://localhost:3001';
  return {

    getEmployee(mail) {
      return $http({
        method: 'GET',
        url: `${apiUri}/employees?email=ilike.*${mail}*`,
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
        url: `${apiUri}/projects?select=id,name,customer{id,name}&order=name`
      })
      // sort the returned list of projects by customer name
      // FIXME: this should be handled by the API: https://github.com/begriffs/postgrest/issues/509
          .then(result => {
            result.data
            .sort((p1, p2) => {
              if (p1.customer.name.toLowerCase() === p2.customer.name.toLowerCase()) {
                return 0;
              }

              return p1.customer.name.toLowerCase() < p2.customer.name.toLowerCase() ? -1 : 1;
            });

            return result;
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

    logEntry(project, employeeId, date, minutes) {
      return $http({
        method: 'POST',
        url: `${apiUri}/time_entry`,
        data: {
          project: project,
          employee: employeeId,
          date: date,
          minutes: minutes,
          creator: employeeId // FIXME: this should be the logged-in user
        }
      });
    }
  };
};
