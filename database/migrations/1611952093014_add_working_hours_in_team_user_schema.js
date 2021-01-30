"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddWorkingHoursInTeamUserSchema extends Schema {
  up() {
    this.table("team_user", (table) => {
      // alter table
      table.integer("working_hours").unsigned().defaultTo(8);
    });
  }

  down() {
    this.table("team_user", (table) => {
      // reverse alternations
      table.dropColumn("working_hours");
    });
  }
}

module.exports = AddWorkingHoursInTeamUserSchema;
