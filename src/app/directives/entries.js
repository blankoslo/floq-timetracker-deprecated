import EntriesCtrl from '../controllers/entriesCtrl.js';

export default () => ({
  template: require('../views/entries.html'),
  controller: EntriesCtrl,
  scope: true
});
