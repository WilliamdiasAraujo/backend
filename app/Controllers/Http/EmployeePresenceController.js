"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const EmployeePresence = use("App/Models/EmployeePresence");
const Team = use("App/Models/Team");

const format = require("date-fns/format");
const add = require("date-fns/add");

class EmployeePresenceController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async index({ params }) {
    const userId = params.userId;
    const team = await Team.find(params.teamId);
    const user = await team.users().where("user_id", "=", userId).first();
    // const now = new Date();
    // const nowStr = format(now, "yyyy-MM-dd");
    // const threeMonthsAfter = add(now, {
    //   months: 3,
    // });
    // const threeMonthsAfterStr = format(threeMonthsAfter, "yyyy-MM-dd");
    // const { from = threeMonthsAfterStr, to = nowStr } = request.get();

    await user.load("employeePresences", (b) =>
      b.where("team_id", "=", params.teamId)
    );
    return user.getRelated("employeePresences");
    // .fetch();
    // .where("ended_at", ">=", from)
    // .where("started_at", "<=", to)
    // .where("user", auth.user.id)
    // .fetch();
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store({ request, auth, params }) {
    const data = request.only(["started_at", "finished_at"]);
    const user = auth.user;
    const team = await user
      .teams()
      .where("team_id", "=", params.teamId)
      .first();
    const employeePresence = await team.employeePresences().create({
      ...data,
      user_id: user.id,
    });
    return employeePresence;
  }
}

module.exports = EmployeePresenceController;
