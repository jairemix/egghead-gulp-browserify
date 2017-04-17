export function greet (name: String) {
  console.log(`Hello ${name}`);
};

export class Hero {
  private name: String;
  private alias: String;
  constructor (name: String, alias: String) {
    this.name = name;
    this.alias = alias;
  }
  greet () {
    console.log(`
      Hello. My name is ${this.name}.
      I am ${this.alias}.
    `);
  }
};
