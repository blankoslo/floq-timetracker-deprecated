import CalendarCtrl from '../controllers/calendarCtrl';

export default () => ({
  controller: CalendarCtrl,
  template: require('../views/calendar.html'),
  scope: true
});
