import welcome from './welcome.js';
import session from './session.js';
import users from './users.js';

const controllers = [
  welcome,
  session,
  users,
];

export default (app) => controllers.forEach((f) => f(app));
