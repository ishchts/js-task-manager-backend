import welcome from './welcome.js';

const controllers = [
  welcome,
];

export default (app) => controllers.forEach((f) => f(app));
