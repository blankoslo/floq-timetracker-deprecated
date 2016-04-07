export default function() {
  return {
    template: require('../views/projectAppender.html'),
    controller: ($scope, Api) => {

      $scope.openProjectDialog = () => {
        $scope.showDialog = true;
        Api.getProjects().then((result) => {
          console.log(result.data);
          $scope.projects = result.data;
        });
      }

      $scope.appendProject = (project) => {
        $scope.$broadcast('projectAppended', project);
        $scope.showDialog = false;
      }
    }
  }
}
