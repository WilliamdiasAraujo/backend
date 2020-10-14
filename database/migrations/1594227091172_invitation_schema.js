"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class InvitationSchema extends Schema {
  up() {
    this.create("invitations", (table) => {
      table.increments();
      table.integer("sender_user_id").unsigned();
      table.foreign("sender_user_id").references("id").inTable("users");
      table.integer("target_user_id").unsigned();
      table.foreign("target_user_id").references("id").inTable("users");
      table.integer("team_id").unsigned();
      table.foreign("team_id").references("id").inTable("teams");
      table.text("message");
      table.enum("status", ["pending", "refused"]).defaultTo("pending");
      table.timestamps();
    });
  }

  down() {
    this.drop("invitations");
  }
}

module.exports = InvitationSchema;
