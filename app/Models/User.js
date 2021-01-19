"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use("Hash");

class User extends Model {
  static get hidden() {
    return ["password", "confirmation_code"];
  }

  static boot() {
    super.boot();

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook("beforeSave", async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany("App/Models/Token");
  }

  invitations() {
    return this.hasMany("App/Models/Invitation", "id", "target_user_id");
  }

  teams() {
    return this.belongsToMany("App/Models/Team");
  }

  createdTeams() {
    return this.hasMany("App/Models/Team", "id", "owner_id");
  }

  studentPresences() {
    return this.hasMany("App/Models/StudentPresence");
  }

  schoolLists() {
    return this.manyThrough("App/Models/StudentPresence", "schoolList");
  }

  employeePresences() {
    return this.hasMany("App/Models/EmployeePresence");
  }

  justifications() {
    return this.hasMany("App/Models/Justification");
  }
}

module.exports = User;
