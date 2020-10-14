"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class SchoolList extends Model {
  team() {
    return this.belongsTo("App/Models/Team");
  }
  studentPresences() {
    return this.hasMany("App/Models/StudentPresence", "id", "school_list_id");
  }
}

module.exports = SchoolList;
