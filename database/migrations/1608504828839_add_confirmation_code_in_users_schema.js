"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddConfirmationCodeInUsersSchema extends Schema {
  up() {
    this.table("users", (table) => {
      // alter table
      table.string("confirmation_code").defaultTo(null);
    });
  }

  down() {
    this.table("users", (table) => {
      // reverse alternations
      table.dropColumn("confirmation_code");
    });
  }
}

module.exports = AddConfirmationCodeInUsersSchema;
