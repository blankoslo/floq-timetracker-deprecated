export default class AppCtrl {
  constructor($scope, $rootScope, Auth, Api) {

    this.test = 'working';
    $scope.loading = true;

    var overrideUser = window.location.hash.substring(1);

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