export default class AppCtrl {
  constructor($rootScope, Auth, Api) {

    this.test= 'working';
    
    var overrideUser = window.location.hash.substring(1);

    function broadcastEmployee() {
      $rootScope.$broadcast('userChanged', Auth.getEmployee());
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
