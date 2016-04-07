import angular from 'angular';
import moment from 'moment';

import appCtrl from './controllers/appCtrl.js'
import appDirective from './directives/app.js';
import entriesDirective from './directives/entries.js';
import weeklyCalendar from './directives/weeklyCalendar.js';
import projectAppender from './directives/projectAppender.js';
import apiFactory from './services/api.js';
import '../style/main.scss';

const MODULE_NAME = 'timestamp';

angular.module(MODULE_NAME, [])
  .controller('AppCtrl', appCtrl)
  .directive('app', appDirective)
  .directive('entries', entriesDirective)
  .directive('weekly', weeklyCalendar)
  .directive('appendProject', projectAppender)
  .factory('Api', apiFactory);

moment.locale('no', {
  months : "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),
  monthsShort : "jan._feb._mars_apr._mai_juni_juli._aug_sept._okt._nov._des.".split("_"),
  weekdays : "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
  weekdaysShort : "søn_man_tir_ons_tor_fre_lør".split("_"),
  week : {
      dow : 1,
      doy : 4
  }});

var appElement = document.createElement("app");
document.getElementById("app").appendChild(appElement);

angular.element(document.getElementById("app")).ready(function() {
  angular.bootstrap(document.getElementById("app"), [MODULE_NAME]);
});

export default MODULE_NAME;
