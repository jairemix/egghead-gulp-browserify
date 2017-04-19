// 3 ways of declaring a global variable
// 1. declare in .d.ts file (only necessary in entry file)
/// <reference path="globals.d.ts" />

// 2. upcast window object
// const angular = (window as any).angular;

// 3. use declare keyword
// declare const angular: any;

import { Hero } from './hero/hero';
import app from './main/main.module';

let peeta = new Hero('Peeta Mellark', 'the boy with the bread');
peeta.greet();

app.run(() => {
  console.log('app running');
});

console.log('window.angular', window.angular);
