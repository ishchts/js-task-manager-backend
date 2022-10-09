import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      const statuses = await app.objection.models.taskStatus.query();

      reply.render('/statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      reply.render('statuses/new');
      return reply;
    })
    .get('/statuses/:id/edit', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      const taskStatus = await app.objection.models.taskStatus.query().findById(req.params.id);
      reply.render('statuses/edit', { taskStatus });
      return reply;
    })
    .post('/statuses', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      try {
        const validStatus = await app.objection.models.taskStatus.fromJson(req.body.data);
        await app.objection.models.taskStatus.query().insert(validStatus);
        req.flash('success', i18next.t('flash.taskStatus.create.success'));
        reply.redirect('/statuses');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.taskStatus.create.error'));
        reply.render('/statuses/new', { errors: data });
      }
      return reply;
    })
    .post('/statuses/:id/edit', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      const taskStatus = new app.objection.models.taskStatus();
      taskStatus.$set({ id: req.params.id, name: req.body.data.name });
      try {
        await taskStatus.$query().findById(req.params.id).patch(req.body.data);
        req.flash('success', i18next.t('flash.taskStatus.edit.success'));
        reply.redirect('/statuses');
      } catch (err) {
        req.flash('error', i18next.t('flash.taskStatus.edit.error'));
        reply.render('statuses/edit', { taskStatus });
      }
      return reply;
    })
    .post('/statuses/:id/delete', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      try {
        await app.objection.models.taskStatus.query().deleteById(req.params.id);
        req.flash('info', i18next.t('flash.taskStatus.delete.success'));
        reply.redirect('/statuses');
      } catch (e) {
        req.flash('error', i18next.t('flash.taskStatus.delete.error'));
        reply.redirect('/statuses');
      }
      return reply;
    });
};
