// 3 ways of declaring a global variable
// const angular = (window as any).angular;

declare const angular: any;

/// <reference path="../window.d.ts" />

export default angular.module('ionicApp.pages', [])
  .name;
