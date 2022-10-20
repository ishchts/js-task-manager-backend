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
        status,
        executor,
        label,
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

          if (status) {
            trxTasks.modify('filterBy', 'statusId', Number(status));
          }

          if (executor) {
            trxTasks.modify('filterBy', 'executorId', Number(executor));
          }

          if (label) {
            trxTasks.modify('filterBy', 'tasksLabels.id', Number(label));
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
            status,
            executor,
            label,
            onlyMyTasks,
          },
        });
      } catch (e) {
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

      const tasks = new app.objection.models.tasks();
      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();

      reply.render('tasks/new', {
        tasks, statuses, users, labels,
      });
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
      const tasks = new app.objection.models.tasks();

      const {
        body: {
          data: {
            labels: labelIds, statusId, executorId, name,
            ...restData
          },
        },
      } = req;

      const labelsFound = await app.objection.models.label
        .query().findByIds(labelIds ?? []);

      tasks.$set({ ...req.body.data, labels: labelsFound });

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
      const labels = await app.objection.models.label.query();
      const task = await app.objection.models.tasks
        .query().findById(req.params.id).withGraphJoined('[tasksLabels]');

      reply.render('tasks/edit', {
        task, statuses, users, labels,
      });
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
      const {
        executorId,
        statusId,
        labels: labelIds,
        ...restBodyData
      } = req.body.data;

      const tasksLabels = await app.objection.models.label
        .query().findByIds([...labelIds]);

      const updatedTask = {
        ...restBodyData,
        id: Number(taskId),
        creatorId: req.user.id,
        executorId: Number(executorId) || '',
        statusId: Number(statusId),
        tasksLabels: tasksLabels.map((taskLabel) => ({ id: taskLabel.id })),
      };
      task.$set(updatedTask);
      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();

      try {
        await app.objection.models.tasks.transaction(async (trx) => {
          await app.objection.models.tasks
            .query(trx).upsertGraph(updatedTask, {
              relate: true, unrelate: true, noDelete: true,
            });
        });
        req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect('/tasks');
      } catch (err) {
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        reply.render('tasks/edit', {
          task, statuses, users, labels, errors: err.data,
        });
      }

      return reply;
    })
    .delete('/tasks/:id/delete', async (req, reply) => {
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
