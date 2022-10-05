const objectionUnique = require('objection-unique');
const BaseModel = require('./base-model.cjs');
const encrypt = require('../lib/secure.cjs');

const unique = objectionUnique({ fields: ['email'] });

module.exports = class User extends unique(BaseModel) {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password', 'firstName', 'lastName'],
      properties: {
        id: { type: 'integer' },
        firstName: {
          type: 'string',
          minLength: 1,
        },
        lastName: {
          type: 'string',
          minLength: 1,
        },
        email: {
          type: 'string',
          title: 'User email. Must be unique',
          minLength: 1,
        },
        password: {
          type: 'string',
          minLength: 3,
        },
      },
    };
  }

  set password(value) {
    this.passwordDigest = encrypt(value);
  }

  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }
};
