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
        url: `${apiUri}/projects?select=id,name,customer{id,name}`
      });
    },

    getHolidays(fromDate, toDate) {
      return $http({
        method: 'GET',
        url: `${apiUri}/holidays?date=gte.${fromDate}&date=lte.${toDate}`
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

    getAccumulatedOvertime(employeeId, endDate) {
      return $http({
        method: 'POST',
        url: `${apiUri}/rpc/accumulated_overtime_for_employee`,
        data: {
          employee_id: employeeId,
          end_date: endDate
        }
      });
    },

    getLockedDate(employeeId) {
      return $http({
        method: 'GET',
        url: `${apiUri}/timelock?employee=eq.${employeeId}&select=commit_date&order=created.desc&limit=1`
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
    },

    logLockedDate(employeeId, date) {
      return $http({
        method: 'POST',
        url: `${apiUri}/timelock`,
        data: {
          employee: employeeId,
          commit_date: date,
        }
      });
    }

  };
};
