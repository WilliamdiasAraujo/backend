"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TeamsSchema extends Schema {
  up() {
    this.create("teams", (table) => {
      table.increments();
      table.string("name").notNullable();
      table.string("type").notNullable();
      table.string("adress").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("teams");
  }
}

module.exports = TeamsSchema;
