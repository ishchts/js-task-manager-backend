import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', async (req, reply) => {
      if (!reply.locals.isAuth()) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect('/');
        return reply;
      }

      const {
        statusId,
        executorId,
        labelId,
        onlyMyTasks,
      } = req.query;

      try {
        const labels = await app.objection.models.label.query();
        const statuses = await app.objection.models.taskStatus.query();
        const users = await app.objection.models.user.query();

        const tasks = await app.objection.models.tasks.transaction(async (trx) => {
          const trxTasks = app.objection.models.tasks
            .query(trx)
            .withGraphJoined('[status, userCreator, userExecutor, tasksLabels]');

          if (statusId) {
            trxTasks.modify('filterBy', 'statusId', Number(statusId));
          }

          if (executorId) {
            trxTasks.modify('filterBy', 'executorId', Number(executorId));
          }

          if (labelId) {
            trxTasks.modify('filterBy', 'labelId', Number(labelId));
          }

          if (onlyMyTasks) {
            trxTasks.modify('filterBy', 'creatorId', req.user.id);
          }
          return trxTasks;
        });

        reply.render('tasks/index', {
          tasks,
          statuses,
          users,
          labels,
          filters: {
            statusId,
            executorId,
            labelId,
            onlyMyTasks,
          },
        });
      } catch (e) {
        console.log('asdeee333', e);
        console.log('asdeee222', e.data);
        reply.redirect('/');
      }

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
      const labels = await app.objection.models.label.query();

      reply.render('tasks/new', { statuses, users, labels });
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
      const labelList = await app.objection.models.label.query();

      const {
        body: {
          data: {
            labels: labelIds, statusId, executorId, name,
            ...restData
          },
        },
      } = req;
      const tasks = { name };

      const labelsFound = await app.objection.models.label
        .query().findByIds(labelIds ?? []);

      const creatorId = req.user.id;
      const newTask = {
        ...restData,
        name,
        statusId: Number(statusId),
        executorId: Number(executorId),
        creatorId,
        tasksLabels: labelsFound,
      };

      try {
        await app.objection.models.tasks.transaction(async (trx) => {
          await app.objection.models.tasks
            .query(trx).insertGraph({ ...newTask }, { relate: ['tasksLabels'] });
        });

        req.flash('info', i18next.t('flash.tasks.create.sucess'));
        reply.redirect('/tasks');
      } catch (err) {
        const { data } = err;

        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', {
          statuses,
          users,
          labels: labelList,
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
        .withGraphJoined('[status, userCreator, userExecutor, tasksLabels]')
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
