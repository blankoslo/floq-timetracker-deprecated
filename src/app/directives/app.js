import appCtrl from '../controllers/appCtrl';

export default () => ({
  template: require('../views/app.html'),
  controller: appCtrl,
  controllerAs: 'app',
  scope: true
});
