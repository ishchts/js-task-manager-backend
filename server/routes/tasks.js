import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      const tasks = await app.objection.models.tasks.query().withGraphJoined('[status, userCreator, userExecutor]');

      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/new', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();

      reply.render('tasks/new', { statuses, users });
      return reply;
    })
    .post('/tasks', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();

      const statusId = Number(req.body.data.statusId) || '';
      const executorId = Number(req.body.data.executorId) || '';
      const tasks = { name: req.body.data.name };
      try {
        const creatorId = req.user.id;
        await app.objection.models.tasks
          .query().insertGraph({ ...req.body.data, statusId, creatorId });
        req.flash('info', i18next.t('flash.tasks.create.sucess'));
        reply.redirect('/tasks');
      } catch (err) {
        const { data } = err;

        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', {
          users,
          statuses,
          errors: data,
          statusId,
          executorId,
          tasks,
        });
      }

      return reply;
    })
    .get('/tasks/:id', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      const task = await app.objection.models.tasks
        .query()
        .withGraphJoined('[status, userCreator, userExecutor]')
        .findById(req.params.id);

      reply.render('/tasks/detail', { task });
      return reply;
    })
    .get('/tasks/:id/edit', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const task = await app.objection.models.tasks.query().findById(req.params.id);

      reply.render('tasks/edit', { task, statuses, users });
      return reply;
    })
    .post('/tasks/:id/edit', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }
      const { id: taskId } = req.params;

      const task = new app.objection.models.tasks();
      const updatedTask = {
        ...req.body.data,
        id: Number(taskId),
        creatorId: req.user.id,
        executorId: Number(req.body.data.executorId) || '',
        statusId: Number(req.body.data.statusId),
      };
      task.$set(updatedTask);

      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();

      try {
        await app.objection.models.tasks.query().upsertGraph(updatedTask);
        req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect('/tasks');
      } catch (err) {
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        reply.render('tasks/edit', {
          task, statuses, users, errors: err.data,
        });
      }

      return reply;
    })
    .post('/tasks/:id/delete', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      try {
        const task = await app.objection.models.tasks.query().findById(req.params.id);
        if (task.creatorId === req.user.id) {
          await app.objection.models.tasks.query().deleteById(req.params.id);
          req.flash('info', i18next.t('flash.tasks.delete.success'));
        } else {
          req.flash('error', i18next.t('flash.tasks.delete.permission'));
        }
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
      }

      reply.redirect('/tasks');
      return reply;
    });
};
