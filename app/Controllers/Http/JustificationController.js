"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Helpers = use("Helpers");
const Justification = use("App/Models/Justification");
const Team = use("App/Models/Team");
const SchoolList = use("App/Models/SchoolList");
const StudentPresence = use("App/Models/StudentPresence");
/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use("Env");

class JustificationController {
  async index({ request, params }) {
    const query = request.get();
    const team = await Team.find(params.teamId);
    const justifications = team.justifications().with("user").with("team");
    return await justifications.paginate(query.page || 1, query.perPage || 20);
  }

  async teamCount({ params }) {
    // const query = request.get();
    const team = await Team.find(params.teamId);
    const justifications = team.justifications().where({ status: "pending" });
    return await justifications.count();
  }

  async auth({ request, auth, params }) {
    const query = request.get();
    const user = auth.user;
    const teamId = params.teamId;
    const justifications = user
      .justifications()
      .where("team_id", "=", teamId)
      .with("user")
      .with("team");
    // .fetch();
    // return justifications;
    return await justifications.paginate(query.page || 1, query.perPage || 20);
  }

  async store({ request, response, auth, params }) {
    const user = auth.user;
    const data = request.only(["message", "started_at", "finished_at"]);
    const file = request.file("media", {
      types: ["image"],
      size: "10mb",
    });

    let media_url = undefined;

    if (file) {
      const filePath = `uploads/user/${user.id}`;
      const fileName = `justification-${new Date().getTime()}.${file.subtype}`;
      await file.move(Helpers.tmpPath(filePath), {
        name: fileName,
        overwrite: true,
      });
      if (!file.moved()) {
        response.send({ error: file.error });
      }

      media_url = `${Env.get("APP_URL")}/${filePath}/${file.fileName}`;
    }
    const team = await Team.find(params.teamId);
    return await team
      .justifications()
      .create({ ...data, media_url, user_id: user.id });
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async accept({ params }) {
    // const user = auth.user;
    const justification = await Justification.find(params.justificationId);
    justification.merge({ status: "accepted" });
    let result = null;
    let schoolListIds;
    const teamId = justification.team_id;
    let schoolLists;
    if (justification.started_at && justification.finished_at) {
      schoolLists = await SchoolList.query()
        .where("team_id", "=", teamId)
        .andWhere("date_time", ">=", justification.started_at)
        .andWhere("date_time", "<=", justification.finished_at)
        .fetch();
      schoolListIds = schoolLists.rows.map((sl) => sl.id);
      await StudentPresence.query().whereIn("id", schoolListIds).update({
        is_justified: true,
      });
      result = await StudentPresence.query()
        .whereIn("id", schoolListIds)
        .fetch();
    }
    await justification.save();
    return { justification, result, schoolLists, schoolListIds, teamId };
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async deny({ params }) {
    const justification = await Justification.find(params.justificationId);
    justification.merge({ status: "refused" });
    await justification.save();
    return justification;
  }
}

module.exports = JustificationController;
