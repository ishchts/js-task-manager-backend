// @ts-check

import fastify from 'fastify';
import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test session', () => {
  let app;
  let knex;
  let testData;

  beforeAll(async () => {
    app = fastify();
    await init(app);
    knex = app.objection.knex;
    // @ts-ignore
    await knex.migrate.latest();
    await prepareData(app);
    testData = getTestData();
  });

  it('test sign in / sign out', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/session/new',
    });

    expect(response.statusCode).toBe(200);

    const responseSignIn = await app.inject({
      method: 'POST',
      url: '/session',
      payload: {
        data: testData.users.existing,
      },
    });

    expect(responseSignIn.statusCode).toBe(302);
    // после успешной аутентификации получаем куки из ответа,
    // они понадобятся для выполнения запросов на маршруты требующие
    // предварительную аутентификацию
    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value };

    const responseSignOut = await app.inject({
      method: 'POST',
      url: '/session-logout',
      // используем полученные ранее куки
      cookies: cookie,
    });

    expect(responseSignOut.statusCode).toBe(302);
  });

  afterAll(async () => {
    // await knex.migrate.rollback();
    await app.close();
  });
});
