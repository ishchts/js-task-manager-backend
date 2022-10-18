import { fileURLToPath } from 'url';
import path from 'path';

import fastifySensible from '@fastify/sensible';
// import fastifyErrorPage from 'fastify-error-page';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
import fastifyFormbody from '@fastify/formbody';
import fastifySecureSession from '@fastify/secure-session';
import fastifyPassport from '@fastify/passport';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import fastifyMethodOverride from 'fastify-method-override';
import fastifyObjectionjs from 'fastify-objectionjs';
import Rollbar from 'rollbar';

import qs from 'qs';
import Pug from 'pug';
import i18next from 'i18next';
import ru from './locales/ru.js';

import getHelpers from './helpers/index.js';
import addRoutes from './routes/index.js';
import * as knexConfig from '../knexfile.js';
import models from './models/index.js';
import FormStrategy from './lib/passport-strategies/form-strategy.js';

const __dirname = fileURLToPath(path.dirname(import.meta.url));

const mode = process.env.NODE_ENV || 'development';

const setUpViews = (app) => {
  const helpers = getHelpers(app);
  app.register(fastifyView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      ...helpers,
      assetPath: (filename) => `/assets/${filename}`,
    },
    templates: path.join(__dirname, '..', 'server', 'views'),
  });

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });
};

const setUpStaticAssets = (app) => {
  const pathPublic = path.join(__dirname, '..', 'dist');
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

const setupLocalization = async () => {
  await i18next.init({
    lng: 'ru',
    fallbackLng: 'en',
    resources: {
      ru,
    },
  });
};

const addHooks = (app) => {
  app.addHook('preHandler', async (req, reply) => {
    reply.locals = {
      isAuthenticated: () => req.isAuthenticated(),
      isAuth: () => req.isAuthenticated(),
    };
  });
};

const registerPlugins = (fastify) => {
  fastify.register(fastifySensible);
  // fastify.register(fastifyErrorPage);
  fastify.register(fastifyReverseRoutes);
  fastify.register(fastifyFormbody, { parser: qs.parse });

  fastify.register(fastifySecureSession, {
    secret: process.env.SESSION_KEY,
    cookie: {
      path: '/',
    },
  });

  fastifyPassport.registerUserDeserializer(
    (user) => fastify.objection.models.user.query().findById(user.id),
  );
  fastifyPassport.registerUserSerializer((user) => Promise.resolve(user));
  fastifyPassport.use('form', new FormStrategy('form', fastify));
  fastify.register(fastifyPassport.initialize());
  fastify.register(fastifyPassport.secureSession());

  fastify.decorate('fpass', fastifyPassport);

  fastify.decorate('fauthenticate', (...args) => fastifyPassport.authenticate(
    'form',
    {
      failureRedirect: '/',
      failureFlash: i18next.t('flash.authError'),
    },
  )(...args));

  fastify.register(fastifyMethodOverride);
  fastify.register(fastifyObjectionjs, {
    knexConfig: knexConfig[mode],
    models,
  });
};

const setupErrorHandler = (app) => {
  app.setErrorHandler(async (err, req, reply) => {
    const rollbar = new Rollbar({
      accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
      captureUncaught: true,
      captureUnhandledRejections: true,
    });

    rollbar.error(err, req);
    rollbar.log('Hello world!');
    console.log('asdasdasd');
    reply.send(err);
  });
};

// eslint-disable-next-line no-unused-vars
export default async (fastify, options) => {
  setupErrorHandler(fastify);
  registerPlugins(fastify);

  await setupLocalization();
  setUpViews(fastify);
  setUpStaticAssets(fastify);
  addRoutes(fastify);
  addHooks(fastify);

  fastify.after((err) => {
    console.log('fastify.after fastify.after', err);
  });

  fastify.ready((err) => {
    console.log('fastify.ready fastify.ready fastify.ready', err);
  });
};
