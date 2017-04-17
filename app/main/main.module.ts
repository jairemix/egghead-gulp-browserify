import pages from '../pages/pages.module';

// temporary fix for global variables
const angular = (window as any).angular;

export default angular.module('ionicApp.main', ['ionic', pages]);
