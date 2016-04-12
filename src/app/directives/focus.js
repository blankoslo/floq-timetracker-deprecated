export default ($timeout) => ({
  scope: {
    trigger: '@focus'
  },
  link: (scope, element) => {
    scope.$watch('trigger', (value) => {
      if (value === 'true') {
        $timeout(() => {
          element[0].focus();
        });
      }
    });
  }
});
