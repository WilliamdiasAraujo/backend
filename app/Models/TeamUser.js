"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class TeamUser extends Model {
  //
  static get table() {
    return "team_user";
  }

  static get hidden() {
    return ["created_at", "updated_at"];
  }

  user() {
    return this.belongsTo("App/Models/User");
  }

  team() {
    return this.belongsTo("App/Models/Team");
  }
}

module.exports = TeamUser;
