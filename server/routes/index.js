import welcome from './welcome.js';
import session from './session.js';
import users from './users.js';
import statuses from './statuses.js';

const controllers = [
  welcome,
  session,
  users,
  statuses,
];

export default (app) => controllers.forEach((f) => f(app));
