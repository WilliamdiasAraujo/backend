"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const SchoolList = use("App/Models/SchoolList");
const Team = use("App/Models/Team");

class SchoolListController {
  async index({ params }) {
    return await SchoolList.query().where({ team_id: params.teamId }).fetch();
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store({ request, params }) {
    const data = request.only([
      "date_time",
      "total_class_amount",
      "class_duration",
    ]);
    const team = await Team.find(params.teamId);
    const participants = await team.users().fetch();
    const { presences: allPresences } = request.only(["presences"]);

    const presences = participants.rows.map((participant) => {
      const presence = allPresences.find((p) => p.user_id == participant.id);
      presence.class_amount =
        presence.class_amount > data.total_class_amount
          ? data.total_class_amount
          : presence.class_amount;
      return presence ? presence : { user_id: participant.id, class_amount: 0 };
    });

    const schoolList = await team.schoolLists().create(data);
    await schoolList.studentPresences().createMany(presences);

    await schoolList.load("studentPresences");
    return schoolList;
  }

  async show({ params }) {
    const schoolList = await SchoolList.find(params.schoolListId);

    await schoolList.load("studentPresences");
    return schoolList;
  }

  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const schoolList = await SchoolList.find(params.schoolListId);
    await schoolList.delete();
    return response.status(200).send({ message: "this item has been deleted" });
  }
}

module.exports = SchoolListController;
