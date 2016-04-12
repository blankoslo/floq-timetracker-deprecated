import app from './app';
import 'babel-polyfill';

describe('app', () => {
  describe('AppCtrl', () => {
    var ctrl;
    var scope;
    var Auth;
    var Api;

    beforeEach(angular.mock.module('timestamp'));
    beforeEach(angular.mock.inject(($controller, $rootScope) => {
      Auth = {};
      Api = {
        getLoggedInUser: () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve('hans');
            }, 500);
          });
        }
      };
      scope = $rootScope.$new();
      ctrl = $controller('AppCtrl', {
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
      expect(ctrl.getOverrideUser("/timestamp/lasse")).toBe("lasse");
    });

    it('should not get overriden user if not present and trailing slash', () => {
      expect(ctrl.getOverrideUser("/timestamp/")).toBe('');
    });

    it('should not get overriden user if not present and not traling slash slash', () => {
      expect(ctrl.getOverrideUser("/timestamp")).toBe('');
    });

  });
});
