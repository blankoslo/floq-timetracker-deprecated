export default ($rootScope, $compile) => {
  let ACTIVE_CLASS = 'active';
  let CONTAINER = 'app';
  let template = require('../views/notification.html');

  return {
    error: (message, timer = 5000) => {
      let scope = $rootScope.$new();
      let containerElement = angular.element(document.getElementById(CONTAINER));
      scope.message = message;
      const element = $compile(template)(scope);

      containerElement.append(element);
      element.addClass(ACTIVE_CLASS);

      setTimeout(() => {
        element.removeClass(ACTIVE_CLASS);
        element.remove();
      }, timer);
    }
  };
};