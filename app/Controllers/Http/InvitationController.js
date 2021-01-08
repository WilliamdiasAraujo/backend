"use strict";

const { query } = require("../../Models/User");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const Invitation = use("App/Models/Invitation");
const Team = use("App/Models/Team");
const User = use("App/Models/User");

class InvitationController {
  async auth({ auth }) {
    const user = auth.user;
    return await user
      .invitations()
      .where({ status: "pending" })
      .with("team")
      .fetch();
  }
  async authCount({ auth }) {
    const user = auth.user;
    return await user.invitations().where({ status: "pending" }).count();
  }

  async team({ params }) {
    const team = await Team.find(params.teamId);
    return await team.invitations().fetch();
  }

  async store({ request, params, auth, response }) {
    const data = request.only(["message", "email"]);
    const author_id = auth.user.id;

    if (auth.user.email === data.email) {
      return response
        .status(402)
        .send({ message: "target user cannot be the author user" });
    }

    const targetUser = await User.query().where({ email: data.email }).first();

    if (!targetUser) {
      return response
        .status(400)
        .send({ message: "Email não cadastrado no sistema" });
    }

    const team = await Team.find(params.teamId);
    const invitation = await team.invitations().create({
      message: data.message,
      author_id,
      target_user_id: targetUser.id,
    });
    if (team.type === "school") {
      await team.users().attach([invitation.target_user_id]);
    }

    return invitation;
  }

  async accept({ params, response, auth }) {
    const invitation = await Invitation.find(params.invitationId);
    const user = auth.user;

    if (invitation.target_user_id !== user.id) {
      return response.status(404).send({ message: "this item is not found" });
    }
    if (invitation.status === "refused") {
      return response
        .status(401)
        .send({ message: "this invitation was refused" });
    }

    const team = await invitation.team().fetch();
    const participant = await team
      .users()
      .where("user_id", "=", invitation.target_user_id)
      .first();
    if (!participant) {
      team.users().attach([invitation.target_user_id]);
    }
    await Invitation.query()
      .where({
        target_user_id: invitation.target_user_id,
        team_id: invitation.team_id,
      })
      .delete();
    return response
      .status(200)
      .send({ message: "this invitation has accepted" });
  }

  async deny({ params, response, auth }) {
    const invitation = await Invitation.find(params.invitationId);
    const user = auth.user;

    if (!invitation || invitation.target_user_id !== user.id) {
      return response.status(404).send({ message: "this item is not found" });
    }

    invitation.merge({ status: "refused" });
    invitation.save();

    const team = await invitation.team().first();
    const already = await team.users().where({ user_id: user.id }).first();
    if (already) {
      await team.users().detach([user.id]);
    }
    return invitation;
  }
}

module.exports = InvitationController;
