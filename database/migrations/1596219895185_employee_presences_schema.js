"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class EmployeePresencesSchema extends Schema {
  up() {
    this.create("employee_presences", (table) => {
      table.increments();
      table.date("started_at");
      table.date("finished_at");
      table.integer("user_id").unsigned();
      table.foreign("user_id").references("id").inTable("users");
      table.integer("team_id").unsigned();
      table
        .foreign("team_id")
        .references("id")
        .inTable("teams")
        .onDelete("CASCADE");
      table.timestamps();
    });
  }

  down() {
    this.drop("employee_presences");
  }
}

module.exports = EmployeePresencesSchema;
