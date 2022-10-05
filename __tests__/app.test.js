

// @ts-check

import {
  describe, beforeAll, it, expect,
} from '@jest/globals';

import fastify from 'fastify';
import init from '../server/plugin.js';

describe('requests', () => {
  let app;

  beforeAll(async () => {
    app = fastify({ logger: { prettyPrint: true } });
    await init(app);
  });

  it('GET 200', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/',
    });
    expect(res.statusCode).toBe(200);
  });

  it('GET 404', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/wrong-path',
    });
    expect(res.statusCode).toBe(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
