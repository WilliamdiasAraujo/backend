"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RenameSenderUserIdToAuthorIdInInvitationsSchema extends Schema {
  up() {
    this.table("invitations", (table) => {
      table.renameColumn("sender_user_id", "author_id");
    });
  }

  down() {
    this.table("invitations", (table) => {
      table.renameColumn("author_id", "sender_user_id");
    });
  }
}

module.exports = RenameSenderUserIdToAuthorIdInInvitationsSchema;
