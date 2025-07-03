const { v4: uuidv4 } = require('uuid');

class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.role = data.role || 'user';
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
    this.last_login = data.last_login;
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.subscription_plan = data.subscription_plan || 'free';
    this.api_usage = data.api_usage || {
      monthly_analyses: 0,
      total_analyses: 0,
      last_reset: new Date()
    };
  }

  static getCollectionName() {
    return 'users';
  }

  toDict() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password_hash: this.password_hash,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at,
      last_login: this.last_login,
      is_active: this.is_active,
      subscription_plan: this.subscription_plan,
      api_usage: this.api_usage
    };
  }

  toResponse() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      created_at: this.created_at,
      subscription_plan: this.subscription_plan,
      api_usage: this.api_usage
    };
  }
}

module.exports = User;