/// <reference path="globals.d.ts" />
/// <reference path="../typings/index.d.ts" />

import { Hero } from './hero/hero';
import app from './main/main.module';

let peeta = new Hero('Peeta Mellark', 'the boy with the bread');
peeta.greet();

app.run(function ($ionicPlatform, $window: Window) {
  $ionicPlatform.ready(() => {
    if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard) {
      $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      $window.cordova.plugins.Keyboard.disableScroll(true);
    }
    if ($window.StatusBar) {
      // org.apache.cordova.statusbar required
      $window.StatusBar.styleDefault();
    }
  });
  console.log('app running');
});

console.log('angular', angular);
console.log('ionic', ionic);
console.log('window.ionic', window.ionic);
console.log('window.angular', window.angular);
console.log('window.cordova', window.cordova);
