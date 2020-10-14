"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddClassDurationInTeamsSchema extends Schema {
  up() {
    this.table("teams", (table) => {
      table.integer("class_duration").unsigned();
      table.renameColumn("adress", "address");
    });
  }

  down() {
    this.table("teams", (table) => {
      table.dropColumn("class_duration");
      table.renameColumn("address", "adress");
    });
  }
}

module.exports = AddClassDurationInTeamsSchema;
