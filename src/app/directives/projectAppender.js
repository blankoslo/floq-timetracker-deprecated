export default () => ({
  template: require('../views/projectAppender.html'),
  controller: ($scope, $rootScope, Api) => {
    $scope.openProjectDialog = () => {
      $scope.showDialog = true;
      Api.getProjects().then((result) => {
        $scope.projects = result.data;
      });
    };

    $scope.appendProject = (project) => {
      $rootScope.$broadcast('projectAppended', project);
      $scope.showDialog = false;
    };
  },
  scope: true
});
