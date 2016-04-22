import appCtrl from '../controllers/appCtrl.js';

export default () => ({
  template: require('../views/app.html'),
  controller: appCtrl,
  controllerAs: 'app',
  scope: true
});
