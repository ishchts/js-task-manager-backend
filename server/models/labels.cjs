const { Model } = require('objection');
const objectionUnique = require('objection-unique');
const BaseModel = require('./base-model.cjs');
const Tasks = require('./tasks.cjs');

const unique = objectionUnique({ fields: ['name'] });

module.exports = class Label extends unique(BaseModel) {
  static get tableName() {
    return 'labels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    };
  }

  static relationMappings = {
    tasksLabels: {
      relation: Model.ManyToManyRelation,
      modelClass: Tasks,
      join: {
        from: 'labels.id',
        through: {
          from: 'tasks_labels.labelId',
          to: 'tasks_labels.taskId',
        },
        to: 'tasks.id',
      },
    },
  };
};
