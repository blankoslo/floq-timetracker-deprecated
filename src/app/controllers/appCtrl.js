export default class AppCtrl {
  constructor($scope, $rootScope, Auth, Api) {
    let APPLICATION_ROOT = "timestamp/";

    this.getOverrideUser = (fromPath) => {
      return fromPath.substring(fromPath.lastIndexOf(APPLICATION_ROOT) + APPLICATION_ROOT.length);
    };

    $scope.loading = true;

    let path = window.location.pathname;
    let overrideUser = this.getOverrideUser(path);

    function broadcastEmployee() {
      $rootScope.$broadcast('userChanged', Auth.getEmployee());
      $scope.loading = false;
    }

    Api.getLoggedInUser().then((result) => {
      Auth.setLoggedInUser(result.data);
      if (overrideUser) {
        Api.getEmployee(overrideUser).then((result) => {
          Auth.setEmployee(result.data);
          broadcastEmployee();
        })
      } else {
        Auth.setEmployee(result.data);
        broadcastEmployee();
      }

    }, (result) => {
      console.error(mail + " is not a valid employee");
    });
  }

}