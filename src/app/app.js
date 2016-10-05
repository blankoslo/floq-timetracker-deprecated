import angular from 'angular';
import moment from 'moment';
import ngTouch from 'angular-touch';

import appDirective from './directives/app';
import entriesDirective from './directives/entries';
import calendar from './directives/calendar';
import projectAppender from './directives/projectAppender';
import apiFactory from './services/api';
import authFactory from './services/auth';
import tokenInterceptor from './services/tokenInterceptor';
import appTopDirective from './directives/app-top';
import focusDirective from './directives/focus';
import notification from './services/notification';

import '../style/main.scss';

const MODULE_NAME = 'timestamp';

angular.module(MODULE_NAME, [ngTouch])
  .directive('app', appDirective)
  .directive('entries', entriesDirective)
  .directive('calendar', calendar)
  .directive('appendProject', projectAppender)
  .directive('appTop', appTopDirective)
  .directive('focus', focusDirective)
  .factory('TokenInterceptor', tokenInterceptor)
  .factory('Notification', notification)
  .factory('Auth', authFactory)
  .factory('Api', apiFactory)
  .config(['$httpProvider', ($httpProvider) => {
    $httpProvider.interceptors.push('TokenInterceptor');
  }]);

moment.locale('no', {
  months: [
    'januar',
    'februar',
    'mars',
    'april',
    'mai',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'desember'
  ],
  monthsShort: 'jan_feb_mars_apr_mai_juni_juli_aug_sept_okt_nov_des'.split('_'),
  weekdays: 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
  weekdaysShort: 'søn_man_tir_ons_tor_fre_lør'.split('_'),
  week: {
    dow: 1,
    doy: 4
  }
});

document.addEventListener('readystatechange', () => {
  // Attach to app element when ready
  if (document.readyState === 'complete') {
    const appElement = document.createElement('app');
    const attachTo = document.getElementById('app');
    if (attachTo) {
      attachTo.appendChild(appElement);
    }
    angular.element(document.getElementById('app')).ready(() => {
      angular.bootstrap(document.getElementById('app'), [MODULE_NAME]);
      // Initialize material javascript on dynamically added components
      if (componentHandler) componentHandler.upgradeAllRegistered();
    });
  }
});


export default MODULE_NAME;
