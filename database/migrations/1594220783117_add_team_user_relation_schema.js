"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddTeamUserRelationSchema extends Schema {
  up() {
    this.alter("teams", table => {
      table.integer("owner_id").unsigned();
      table
        .foreign("owner_id")
        .references("id")
        .inTable("users");
    });
  }

  down() {
    this.alter("teams", table => {
      table.dropForeign("owner_id");
      table.dropColumn("owner_id");
    });
  }
}

module.exports = AddTeamUserRelationSchema;
