"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddDurationInTeamsSchema extends Schema {
  up() {
    this.table("teams", (table) => {
      // alter table
      table.integer("duration").defaultTo(null);
    });
  }

  down() {
    this.table("teams", (table) => {
      // reverse alternations
      table.dropColumn("duration");
    });
  }
}

module.exports = AddDurationInTeamsSchema;
