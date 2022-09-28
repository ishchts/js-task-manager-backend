export default (fastify, options, next) => {
  fastify.after((err) => {
    console.log('fastify.after fastify.after', err);
  });

  fastify.ready((err) => {
    console.log('fastify.ready fastify.ready fastify.ready', err);
  });

  fastify.get('/', (req, reply) => {
    reply.send({ hello: 'world' });
  });

  next();
};
