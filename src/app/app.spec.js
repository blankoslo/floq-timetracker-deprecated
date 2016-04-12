import app from './app';
import 'babel-polyfill';

describe('app', () => {
  describe('AppCtrl', () => {
    var ctrl;
    var myScope;
    var Auth;
    var Api;

    beforeEach(angular.mock.module('timestamp'));
    beforeEach(angular.mock.inject(($controller, $rootScope) => {
      Auth = {};
      Api = {
        getLoggedInUser: () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve("hans");
            }, 500)
          });

        }
      };
      myScope = $rootScope.$new()
      ctrl = $controller('AppCtrl', {
        $scope: myScope,
        $rootScope: $rootScope,
        Auth: Auth,
        Api: Api
      });
    }));

    it('should have working test', () => {
      expect(myScope.loading).toBe(true);
    });

    it('should get overriden user', () => {
      expect(ctrl.getOverrideUser("/timestamp/lasse")).toBe("lasse");
    });

    it('should not get overriden user if not present', () => {
      expect(ctrl.getOverrideUser("/timestamp/")).toBe('');
      expect(ctrl.getOverrideUser("/timestamp")).toBe('');
      expect(ctrl.getOverrideUser("/tyme")).toBe('');
    });
  });
})