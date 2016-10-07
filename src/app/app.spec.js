import 'babel-polyfill'; // eslint-disable-line import/no-extraneous-dependencies

import './app';
import appCtrl from './controllers/appCtrl';
import entriesCtrl from './controllers/entriesCtrl';

describe('app', () => {
  describe('AppCtrl', () => {
    let ctrl;
    let scope;
    let Auth;
    let Api;

    beforeEach(angular.mock.module('timestamp'));
    beforeEach(angular.mock.inject(($controller, $rootScope) => {
      Auth = {};
      Api = {
        getLoggedInUser: () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve('hans');
            }, 500);
          })
      };
      scope = $rootScope.$new();
      ctrl = $controller(appCtrl, {
        $scope: scope,
        $rootScope: $rootScope,
        Auth: Auth,
        Api: Api
      });
    }));

    it('should be loading at start', () => {
      expect(scope.loading).toBe(true);
    });

    it('should get overriden user', () => {
      expect(ctrl.getOverrideUser('/timestamp/lasse')).toBe('lasse');
    });

    it('should not get overriden user if not present and trailing slash', () => {
      expect(ctrl.getOverrideUser('/timestamp/')).toBe('');
    });

    it('should not get overriden user if not present and not traling slash slash', () => {
      expect(ctrl.getOverrideUser('/timestamp')).toBe('');
    });
  });

  describe('EntriesCtrl', () => {
    let ctrl;
    let scope;
    let Auth;
    let Api;
    let Notification;

    beforeEach(angular.mock.module('timestamp'));
    beforeEach(angular.mock.inject(($controller, $rootScope) => {
      Auth = {
        getEmployee: () => ({
          id: 1
        })
      };
      Notification = {};
      Api = {
        getLoggedInUser: () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve('hans');
            }, 500);
          }),
        logEntry: () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve('needless to resolve');
            }, 500);
          })
      };
      scope = $rootScope.$new();
      ctrl = $controller(entriesCtrl, {
        $scope: scope,
        $rootScope: $rootScope,
        Api: Api,
        Auth: Auth,
        Notification: Notification
      });
    }));

    // TODO: Make this work
    // it('should test stfuf', () => {
    //   spyOn(Api, 'logEntry');
    //   scope.updateEntry({
    //     hours: '10',
    //     logged: 60,
    //     id: 1
    //   });
    //   expect(Api.logEntry).toHaveBeenCalled();
    // });

    it('should give 0 logged minutes if 30 logged and increase false', () => {
      expect(ctrl.calculateChange(30, false).logged).toBe(0);
    });

    it('should give 7,5h logged increase false and logged minutes 0', () => {
      expect(ctrl.calculateChange(0, false).hours).toBe(7.5);
      expect(ctrl.calculateChange(0, false).logged).toBe(450);
      expect(ctrl.calculateChange(0, false).change).toBe(450);
    });

    it('should give 7h if decrease after 7,5h', () => {
      expect(ctrl.calculateChange(450, false).hours).toBe(7);
      expect(ctrl.calculateChange(450, false).logged).toBe(420);
      expect(ctrl.calculateChange(450, false).change).toBe(-30);
    });

    it('should increase by 30 if increase flag set', () => {
      const start = 60;
      expect(ctrl.calculateChange(start, true).logged).toBe(start + 30);
    });
  });
});
