import angular from 'angular';
import moment from 'moment';

import appCtrl from './controllers/appCtrl.js';
import appDirective from './directives/app.js';
import entriesDirective from './directives/entries.js';
import calendar from './directives/calendar.js';
import projectAppender from './directives/projectAppender.js';
import apiFactory from './services/api.js';
import authFactory from './services/auth.js';
import tokenInterceptor from './services/tokenInterceptor.js';
import appTopDirective from './directives/app-top.js';
import notification from './services/notification.js';

import '../style/main.scss';

const MODULE_NAME = 'timestamp';

angular.module(MODULE_NAME, [])
  .controller('AppCtrl', appCtrl)
  .directive('app', appDirective)
  .directive('entries', entriesDirective)
  .directive('calendar', calendar)
  .directive('appendProject', projectAppender)
  .directive('appTop', appTopDirective)
  .factory('TokenInterceptor', tokenInterceptor)
  .factory('Notification', notification)
  .factory('Auth', authFactory)
  .factory('Api', apiFactory)
  .config(['$httpProvider', ($httpProvider) => {
    $httpProvider.interceptors.push('TokenInterceptor');
  }]);

moment.locale('no', {
  months: 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
  monthsShort: 'jan._feb._mars_apr._mai_juni_juli._aug_sept._okt._nov._des.'.split('_'),
  weekdays: 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
  weekdaysShort: 'søn_man_tir_ons_tor_fre_lør'.split('_'),
  week: {
    dow: 1,
    doy: 4
  }
});

var config = window.config = window.config || {};
document.addEventListener('readystatechange', () => {
  //Attach to app element when ready
  if (document.readyState === "complete") {
    let appElement = document.createElement("app");
    let attachTo = document.getElementById("app");
    if (attachTo) {
      attachTo.appendChild(appElement);
    }
    angular.element(document.getElementById("app")).ready(() => {
      angular.bootstrap(document.getElementById("app"), [MODULE_NAME]);
      // Initialize material javascript on dynamically added components
      if (componentHandler) componentHandler.upgradeAllRegistered();
    });
  }
});


export default MODULE_NAME;