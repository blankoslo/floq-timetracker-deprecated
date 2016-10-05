export default class AppCtrl {
  constructor($scope, $rootScope, Auth, Api, Notification) {
    const APPLICATION_ROOT = 'timestamp';

    this.getOverrideUser = fromPath =>
      fromPath
      .substring(fromPath.lastIndexOf(APPLICATION_ROOT) + APPLICATION_ROOT.length)
      .replace(/\//g, '');

    $scope.loading = true;

    const path = window.location.pathname;
    const overrideUser = this.getOverrideUser(path);

    function broadcastEmployee() {
      $rootScope.$broadcast('userChanged', Auth.getEmployee());
      $scope.loading = false;
    }

    Api.getLoggedInUser().then((result) => {
      Auth.setLoggedInUser(result.data);
      if (overrideUser) {
        Api.getEmployee(overrideUser)
          .then((employee) => {
            Auth.setEmployee(employee.data);
            broadcastEmployee();
          }, () => {
            Notification.error(`Fant ikke overstyrt ansatt '${overrideUser}'`, 100000);
          });
      } else {
        Auth.setEmployee(result.data);
        broadcastEmployee();
      }
    }, () => {
      Notification.error('Fant ikke innlogget ansatt', 100000);
    });
  }
}
