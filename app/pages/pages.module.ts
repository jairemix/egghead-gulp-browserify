import routing from './routing';
import { DashCtrl } from './tab-dash/tab-dash.ctrl';

export default angular.module('ionicApp.pages', [])
  .config(routing)
  .controller('DashCtrl', DashCtrl)
  .name;
