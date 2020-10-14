"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StudentPresenceSchema extends Schema {
  up() {
    this.create("student_presences", (table) => {
      table.increments();
      table.integer("school_list_id").unsigned();
      table
        .foreign("school_list_id")
        .references("id")
        .inTable("school_lists")
        .onDelete("CASCADE");
      table.integer("user_id").unsigned();
      table.foreign("user_id").references("id").inTable("users");
      table.integer("class_amount").unsigned().notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("student_presences");
  }
}

module.exports = StudentPresenceSchema;
