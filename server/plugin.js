import { fileURLToPath } from 'url';
import path from 'path';

import fastifySensible from '@fastify/sensible';
// import fastifyErrorPage from 'fastify-error-page';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
import fastifyFormbody from '@fastify/formbody';
import fastifySecureSession from '@fastify/secure-session';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';

import qs from 'qs';
import Pug from 'pug';
import i18next from 'i18next';
import ru from './locales/ru.js';

import getHelpers from './helpers/index.js';
import addRoutes from './routes/index.js';

const __dirname = fileURLToPath(path.dirname(import.meta.url));

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
};

// eslint-disable-next-line no-unused-vars
export default async (fastify, options) => {
  registerPlugins(fastify);

  await setupLocalization();
  setUpViews(fastify);
  setUpStaticAssets(fastify);
  addRoutes(fastify);

  fastify.after((err) => {
    console.log('fastify.after fastify.after', err);
  });

  fastify.ready((err) => {
    console.log('fastify.ready fastify.ready fastify.ready', err);
  });
};
