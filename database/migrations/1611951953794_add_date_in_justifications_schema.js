"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddDateInJustificationsSchema extends Schema {
  up() {
    this.table("justifications", (table) => {
      // alter table
      table.date("started_at");
      table.date("finished_at");
    });
  }

  down() {
    this.table("justifications", (table) => {
      // reverse alternations
      table.dropColumn("started_at");
      table.dropColumn("finished_at");
    });
  }
}

module.exports = AddDateInJustificationsSchema;
