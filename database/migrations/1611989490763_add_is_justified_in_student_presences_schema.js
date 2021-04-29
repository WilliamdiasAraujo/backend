"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddIsJustifiedInStudentPresencesSchema extends Schema {
  up() {
    this.table("student_presences", (table) => {
      // alter table
      table.boolean("is_justified").defaultTo(false);
    });
  }

  down() {
    this.table("student_presences", (table) => {
      // reverse alternations
      table.dropColumn("is_justified");
    });
  }
}

module.exports = AddIsJustifiedInStudentPresencesSchema;
