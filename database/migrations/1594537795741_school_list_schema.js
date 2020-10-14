"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SchoolListSchema extends Schema {
  up() {
    this.create("school_lists", (table) => {
      table.increments();
      table.integer("team_id").unsigned();
      table
        .foreign("team_id")
        .references("id")
        .inTable("teams")
        .onDelete("CASCADE");
      table.datetime("date_time").notNullable();
      table.integer("class_duration").unsigned().notNullable();
      table.integer("total_class_amount").unsigned().notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("school_lists");
  }
}

module.exports = SchoolListSchema;
