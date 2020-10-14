"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class JustificationSchema extends Schema {
  up() {
    this.create("justifications", (table) => {
      table.increments();
      table.integer("user_id").unsigned();
      table.foreign("user_id").references("id").inTable("users");
      table.integer("team_id").unsigned();
      table
        .foreign("team_id")
        .references("id")
        .inTable("teams")
        .onDelete("CASCADE");
      table
        .enum("status", ["pending", "accepted", "refused"])
        .defaultTo("pending");
      table.text("message");
      table.string("media_url");
      table.timestamps();
    });
  }

  down() {
    this.drop("justifications");
  }
}

module.exports = JustificationSchema;
