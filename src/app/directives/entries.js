import moment from 'moment';

export default function() {
    var MINUTE_INCREMENT = 30;
    var MINUTE_INCREMENT_FIRST_CLICK = 450;

    var controller = ($scope, $rootScope, Api, Auth) => {
        var selectedDay = moment().format("YYYY-MM-DD");

        $scope.logHour = (entry) => {
            var logMinutes = 0;
            if (entry.time == 0) {
                entry.time = MINUTE_INCREMENT_FIRST_CLICK;
                logMinutes = MINUTE_INCREMENT_FIRST_CLICK;
            } else {
                logMinutes = MINUTE_INCREMENT;
                entry.time += MINUTE_INCREMENT;
            }
            $rootScope.$broadcast('entryChanged', logMinutes, selectedDay);
            Api.logEntry(entry.customer, entry.project, Auth.getEmployee().id, selectedDay, logMinutes).then(() => {
                //updateEntries();
            });
        };

        $scope.removeHour = (entry) => {
            entry.time -= MINUTE_INCREMENT;
            $rootScope.$broadcast('entryChanged', -MINUTE_INCREMENT, selectedDay);
            Api.logEntry(entry.customer, entry.project, Auth.getEmployee().id, selectedDay, -MINUTE_INCREMENT).then(() => {
                //updateEntries();
            });
        }

        $scope.$on('dateChanged', (event, date) => {
            selectedDay = date;
            updateEntries();
        })

        $scope.$on('projectAppended', (event, project) => {
            var id = project.customer + project.code;
            var exists = false;
            $scope.entries.forEach((entry) => {
                if (entry.id == id) exists = true;
            });

            if (!exists) {
                $scope.entries.push({
                    customer: project.customer,
                    project: project.code,
                    title: project.title,
                    time: 0
                })
            } else {
                console.log("Project already exists");
            }
        })

        function updateEntries() {
            if (Auth.getEmployee().id) {
                Api.getEntries(Auth.getEmployee().id, selectedDay).then((response) => {
                    $scope.entries = response.data;
                });
            }
        }

        $scope.$on('userChanged', (user) => {
            updateEntries();
        })
    }

    return {
        template: require('../views/entries.html'),
        controller: controller
    }
}
