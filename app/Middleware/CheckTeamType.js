"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Team = use("App/Models/Team");

class CheckTeamType {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ response, params }, next, props) {
    const team = await Team.find(params.teamId);
    if (props.every((type) => type !== team.type)) {
      return response.status(401).send({
        message: "the team type is incompatible with this route action",
      });
    }
    await next();
  }
}

module.exports = CheckTeamType;
