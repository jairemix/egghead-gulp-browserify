import { Hero } from './hero/hero';
import app from './main/main.module';

let peeta = new Hero('Peeta Mellark', 'the boy with the bread');
peeta.greet();

app.run(() => {
  console.log('app running');
});
