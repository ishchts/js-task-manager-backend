import i18next from 'i18next';

export default (app) => {
  app
    .get('/labels', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      const labels = await app.objection.models.label.query();

      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }
      const label = new app.objection.models.label();
      reply.render('labels/new', { label });
      return reply;
    })
    .post('/labels', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      const label = new app.objection.models.label();
      label.$set(req.body.data);

      try {
        await app.objection.models.label.query().insert(req.body.data);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect('/labels');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label, errors: data });
      }

      return reply;
    })
    .get('/labels/:id/edit', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      const label = await app.objection.models.label.query().findById(req.params.id);

      reply.render('labels/edit', { label });
      return reply;
    })
    .post('/labels/:id/edit', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      const label = new app.objection.models.label();
      label.$set({ ...req.body.data, id: req.params.id });

      try {
        await label.$query().findById(req.params.id).patch(req.body.data);
        req.flash('info', i18next.t('flash.labels.edit.success'));
        reply.redirect('/labels');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.edit.error'));
        reply.render('labels/edit', { label, errors: data });
      }

      return reply;
    })
    .delete('/labels/:id/delete', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      try {
        await app.objection.models.label.query().findById(Number(req.params.id)).delete();
        req.flash('info', i18next.t('flash.labels.delete.success'));
        reply.redirect('/labels');
      } catch (e) {
        req.flash('error', i18next.t('flash.labels.delete.error'));
      }

      return reply;
    });
};
