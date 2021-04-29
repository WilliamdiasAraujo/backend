"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class DatetimeSchema extends Schema {
  up() {
    this.table("employee_presences", (table) => {
      // alter table
      table.dropColumn("started_at");
      table.dropColumn("finished_at");
    });
  }

  down() {
    this.table("employee_presences", (table) => {
      // reverse alternations
      table.date("started_at");
      table.date("finished_at");
    });
  }
}

module.exports = DatetimeSchema;
