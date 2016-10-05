import EntriesCtrl from '../controllers/entriesCtrl';

export default () => ({
  template: require('../views/entries.html'),
  controller: EntriesCtrl,
  scope: true
});
