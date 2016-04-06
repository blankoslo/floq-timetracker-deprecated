import angular from 'angular';

import appCtrl from './controllers/appCtrl.js'
import appDirective from './directives/app.js';
import entriesDirective from './directives/entries.js';
import calendarDirective from './directives/calendar.js';
import apiFactory from './services/api.js';
import '../style/main.scss';

const MODULE_NAME = 'timestamp';

angular.module(MODULE_NAME, [])
  .controller('AppCtrl', appCtrl)
  .directive('app', appDirective)
  .directive('entries', entriesDirective)
  .directive('calendar', calendarDirective)
  .factory('Api', apiFactory);

var appElement = document.createElement("app");
document.getElementById("app").appendChild(appElement);

angular.element(document.getElementById("app")).ready(function() {
  angular.bootstrap(document.getElementById("app"), [MODULE_NAME]);
});

export default MODULE_NAME;
