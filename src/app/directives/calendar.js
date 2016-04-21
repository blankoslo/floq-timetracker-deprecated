import CalendarCtrl from '../controllers/calendarCtrl.js';

export default () => ({
  controller: CalendarCtrl,
  template: require('../views/calendar.html'),
  scope: true
});
