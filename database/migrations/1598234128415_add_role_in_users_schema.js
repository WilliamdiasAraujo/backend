"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddRoleInUsersSchema extends Schema {
  up() {
    this.table("users", (table) => {
      table.enum("role", ["admin", "user"]).defaultTo("user");
    });
  }

  down() {
    this.table("users", (table) => {
      table.dropColumn("role");
    });
  }
}

module.exports = AddRoleInUsersSchema;
