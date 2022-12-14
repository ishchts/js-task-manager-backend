const { Model } = require('objection');
const objectionUnique = require('objection-unique');
const BaseModel = require('./base-model.cjs');
const User = require('./user.cjs');
const TaskStatus = require('./task-status.cjs');
const Label = require('./labels.cjs');

const unique = objectionUnique({ fields: ['name'] });

module.exports = class Tasks extends unique(BaseModel) {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'creatorId'],
      properties: {
        id: { type: 'integer' },
        name: {
          type: 'string',
          minLength: 1,
        },
        statusId: {
          type: 'integer',
          minimum: 1,
        },
        creatorId: {
          type: 'integer',
          minimum: 1,
        },
      },
    };
  }

  static get relationMappings() {
    return {
      status: {
        relation: Model.BelongsToOneRelation,
        modelClass: TaskStatus,
        join: {
          from: 'tasks.statusId',
          to: 'task_status.id',
        },
      },
      userCreator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.creatorId',
          to: 'users.id',
        },
      },
      userExecutor: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.executorId',
          to: 'users.id',
        },
      },
      tasksLabels: {
        relation: Model.ManyToManyRelation,
        modelClass: Label,
        join: {
          from: 'tasks.id',
          through: {
            from: 'tasks_labels.taskId',
            to: 'tasks_labels.labelId',
          },
          to: 'labels.id',
        },
      },
    };
  }

  static modifiers = {
    filterBy(query, columnName, value) {
      const { ref } = Tasks;
      query.where(ref(`${columnName}`), value);
    },
  };
};
