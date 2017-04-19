import * as _angular from 'angular';

declare global {
  const angular: typeof _angular
  interface Window {
    angular: typeof _angular
  }
}
