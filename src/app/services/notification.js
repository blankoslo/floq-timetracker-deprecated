export default ($rootScope, $compile) => {
  const ACTIVE_CLASS = 'active';
  const CONTAINER = 'app';
  const template = require('../views/notification.html');

  return {
    error: (message, timer = 5000) => {
      const scope = $rootScope.$new();
      const containerElement = angular.element(document.getElementById(CONTAINER));
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
