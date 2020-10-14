"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class StudentPresence extends Model {
  user() {
    return this.hasOne("App/Models/User");
  }
  schoolList() {
    return this.belongsTo("App/Models/SchoolList", "school_list_id", "id");
  }
}

module.exports = StudentPresence;
