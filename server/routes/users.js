// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      req.log.info('Something important happened!');
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'usersNew' }, (req, reply) => {
      const user = new app.objection.models.user();

      reply.render('users/new', { user });
      return reply;
    })
    .get('/users/:id/edit', { name: 'usersEdit' }, async (req, reply) => {
      if (!reply.locals.isAuthenticated()) {
        req.flash('error', i18next.t('flash.users.edit.error'));
        reply.redirect('/');
        return reply;
      }
      const person = await app.objection.models.user.query().findById(req.params.id);

      if (req.session.passport.id !== person.id) {
        req.flash('error', i18next.t('flash.users.edit.permissionError'));
        reply.redirect('/users');
        return reply;
      }

      reply.render('users/edit', {
        user: {
          id: person.id,
          firstName: person.firstName,
          lastName: person.lastName,
          email: person.email,
        },
      });
      return reply;
    })
    .post('/users/:id/delete', { name: 'usersDelete' }, async (req, reply) => {
      if (!reply.locals.isAuthenticated()) {
        req.flash('error', i18next.t('flash.users.edit.error'));
        reply.redirect('/');
        return reply;
      }
      const { objection: { models } } = app;
      const person = await models.user.query().findById(req.params.id);

      if (req.session.passport.id !== person.id) {
        req.flash('error', i18next.t('flash.users.edit.permissionError'));
        reply.redirect('/users');
        return reply;
      }

      await req.logOut();
      await models.user.query().deleteById(req.params.id);
      req.flash('success', i18next.t('flash.users.delete.success'));
      reply.redirect('/users');
      return reply;
    })
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect('/');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }

      return reply;
    })
    .post('/users/:id/edit', async (req, reply) => {
      try {
        const { id } = req.params;
        const user = new app.objection.models.user();
        user.$set(req.user);
        await user.$query().findById(id).patch(req.body.data);
        req.flash('success', i18next.t('flash.users.edit.success'));
        reply.redirect('/users');
      } catch (err) {
        const { data } = err;

        req.flash('error', i18next.t('flash.users.edit.editError'));
        reply.render('users/new', { user: req.body.data, errors: data });
      }

      return reply;
    });
};
