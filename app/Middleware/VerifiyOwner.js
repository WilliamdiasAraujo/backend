"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const Team = use("App/Models/Team");
const SchoolList = use("App/Models/SchoolList");

class VerifiyOwner {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Function} next
   */
  async handle(ctx, next, props) {
    console.log({ props });
    const results = await Promise.all(props.map((prop) => this[prop](ctx)));
    if (results.some((result) => result !== true)) {
      return ctx.response
        .status(401)
        .send({ message: "the autheticated user is not the team owner" });
    }
    await next();
  }

  async team({ params, auth, response, request }) {
    const user = auth.user;

    // const userTeams = await user.createdTeams().fetch();
    const team = await Team.find(params.teamId);
    if (!team) {
      return false;
    }
    request.entity = team;
    const owner = await team.owner().fetch();

    if (owner.id != user.id) {
      return response
        .status(401)
        .send({ message: "the autheticated user is not the team owner" });
    }
    return true;
  }

  // async schoolList({ params, auth, response, request }) {
  //   const user = auth.user;
  //   // console.log("hu");

  //   const schoolList = await SchoolList.find(params.id);
  //   if (!schoolList) {
  //     return false;
  //   }
  //   request.entity = schoolList;
  //   const team = await schoolList.team().fetch();
  //   const owner = await team.owner().fetch();

  //   // console.log({ user: user.id, owner: owner.id });
  //   if (owner.id != user.id) {
  //     return response
  //       .status(401)
  //       .send({ message: "the autheticated user is not the team owner" });
  //   }
  //   return true;
  // }

  // async newSchoolList({ auth, request, response }) {
  //   const user = auth.user;

  //   const requestData = request.only(["team_id"]);
  //   const teamId = requestData.team_id;
  //   const team = await Team.find(teamId);
  //   if (!team) {
  //     return false;
  //   }
  //   request.entity = team;
  //   const owner = await team.owner().fetch();

  //   if (owner.id != user.id) {
  //     return response
  //       .status(401)
  //       .send({ message: "the autheticated user is not the team owner" });
  //   }
  //   return true;
  // }
}

module.exports = VerifiyOwner;
