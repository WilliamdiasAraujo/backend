"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Team extends Model {
  owner() {
    return this.belongsTo("App/Models/User", "owner_id", "id");
  }

  invitations() {
    return this.hasMany("App/Models/Invitation");
  }

  schoolLists() {
    return this.hasMany("App/Models/SchoolList");
  }

  users() {
    return this.belongsToMany("App/Models/User");
  }

  studentPresences() {
    return this.manyThrough("App/Models/SchoolList", "studentPresences");
  }

  employeePresences() {
    return this.hasMany("App/Models/EmployeePresence");
  }

  justifications() {
    return this.hasMany("App/Models/Justification");
  }
}

module.exports = Team;
