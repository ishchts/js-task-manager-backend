const { Model } = require('objection');
const BaseModel = require('./base-model.cjs');
const User = require('./user.cjs');
const TaskStatus = require('./task-status.cjs');

module.exports = class Tasks extends BaseModel {
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
        },
        creatorId: {
          type: 'integer',
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
    };
  }
};
