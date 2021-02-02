"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const SchoolList = use("App/Models/SchoolList");
const Team = use("App/Models/Team");
const User = use("App/Models/User");

const format = require("date-fns/format");
const formatISO = require("date-fns/formatISO");
const fromUnixTime = require("date-fns/fromUnixTime");

class SchoolListController {
  async index({ params, request }) {
    const query = request.get();
    return await SchoolList.query()
      .where({ team_id: params.teamId })
      .orderBy("date_time", "desc")
      .paginate(query.page || 1, query.perPage || 30);
  }

  async studentPresences({ params, request }) {
    const query = request.get();
    const min = formatISO(fromUnixTime(0));
    const max = formatISO(new Date("9999-12-31"));
    const { from = min, to = max } = query;
    const user = await User.find(params.userId);
    const presences = user
      .schoolLists()
      .whereBetween("date_time", [from, to])
      // .where("date_time", ">=", from)
      // .andWhere("date_time", "<=", to)
      .orderBy("date_time", "asc")
      .with("studentPresences", (b) => {
        b.where("user_id", "=", params.userId);
      });
    // return { to, from };
    return await presences.paginate(query.page || 1, query.perPage || 50);
  }

  async studentProgress({ request, params }) {
    const user = await User.find(params.userId);

    const presences = (
      await user
        .schoolLists()
        .where("team_id", "=", params.teamId)
        .with("studentPresences", (b) => {
          b.where("user_id", "=", params.userId);
        })
        .fetch()
    ).toJSON();
    const team = await Team.find(params.teamId);
    const relative = !team.duration;
    let total = relative ? 0 : team.duration * 60;
    let total_class_duration = 0;
    let watched = 0;
    for (const presence of presences) {
      const totalDuration =
        presence.total_class_amount * presence.class_duration;
      if (relative) {
        total += totalDuration;
      }
      total_class_duration += totalDuration;
      const userPresence = presence.studentPresences[0];
      const computed = presence.class_duration * userPresence.class_amount;
      watched += userPresence.is_justified ? totalDuration : computed;
    }
    const progess =
      total == 0 || watched > total ? 100 : (watched / total) * 100;
    return { progess, relative, total, watched, total_class_duration };
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
    const { presences: allPresences = [] } = request.only(["presences"]);

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

    await schoolList.loadMany({
      studentPresences: null,
      "studentPresences.user": null,
    });

    // const a = await schoolList.studentPresences(b => b.user()).fetch();
    // console.log({ a: a.toJSON() })
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
