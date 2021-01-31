const Team = use("App/Models/Team");
const User = use("App/Models/User");
const TeamUser = use("App/Models/TeamUser");

const format = require("date-fns/format");
const add = require("date-fns/add");

class TeamController {
  //
  async index({ auth }) {
    const { id: owner_id } = auth.user;

    const user = await User.find(owner_id);

    let teams = await user
      .teams()
      .with("owner")
      .with("usersRelation", (builder) => {
        builder.where("user_id", owner_id);
      })
      .fetch();
    let createdTeams = await user
      .createdTeams()
      .with("users")
      .with("usersRelation")
      .fetch();
    return this.mergeTeams(createdTeams, teams);
  }

  mergeTeams(teams1, teams2) {
    teams1.rows.forEach((row) => teams2.addRow(row));
    return teams2;
  }

  async store({ request, auth }) {
    const { id: owner_id } = auth.user;
    const data = request.only(["name", "type", "address", "duration"]); //type = 'school' | 'business'

    const team = await Team.create({ ...data, owner_id });
    return team;
  }

  // async show({ request, auth }) {}

  async update({ request, response, params }) {
    const data = request.only(["name", "adress", "duration"]);
    const team = await Team.find(params.teamId);

    if (!team) {
      return response.status(404).send({ message: "this item is not found" });
    }

    team.merge(data);
    await team.save();

    return team;
  }

  async destroy({ response, params }) {
    const team = await Team.find(params.teamId);

    if (!team) {
      return response.status(404).send({ message: "this item is not found" });
    }

    await team.delete();
    return response.status(200).send({ message: "this item has deleted" });
  }

  async setWorkingHours({ request }) {
    const teamId = request.params.teamId;
    const userId = request.params.userId;
    const { working_hours } = request.only(["working_hours"]);

    if (!working_hours) {
      return { msg: "Invalid 'working_hours' field" };
    }

    const teamUser = await TeamUser.query()
      .where("user_id", "=", userId)
      .andWhere("team_id", "=", teamId)
      .update({
        working_hours,
      });
    if (!teamUser) {
      return { msg: "team-user relation doesn't exist" };
    }
    return { success: true };
  }

  async removeUser({ request }) {
    const teamId = request.params.teamId;
    const userId = request.params.userId;

    if (!teamId || !userId) {
      return { msg: "invalid teamId or userId" };
    }

    let team = await Team.find(teamId);
    // return { team};
    if (!team) {
      return { msg: "team not found" };
    }
    await team.users().detach([userId]);
    // team = await Team.query()
    //   .with("users")
    //   .with("usersRelation")
    //   .where("id", "=", teamId)
    //   .first();
    return { success: true, team };
  }

  // async invitations({ request }) {
  //   const team = request.entity;

  //   const invitations = await team.invitations().fetch();
  //   return invitations;
  // }

  // async schoolList({ params }) {
  //   const team = await Team.find(params.id);
  //   const schoolList = await team.schoolLists().fetch();
  //   return schoolList;
  // }

  // async employeePresences({ params }) {
  //   const team = await Team.find(params.id);
  //   const employeePresences = await team.employeePresences().fetch();
  //   return employeePresences;
  // }

  // async presences({ params, response, auth, request }) {
  //   const user = auth.user;
  //   const now = new Date();
  //   const nowStr = format(now, "yyyy-MM-dd");
  //   const threeMonthsAfter = add(now, {
  //     months: 1,
  //   });
  //   const threeMonthsAfterStr = format(threeMonthsAfter, "yyyy-MM-dd");
  //   const { from = threeMonthsAfterStr, to = nowStr } = request.get();
  //   const team = await Team.find(params.id);

  //   if (user.id != team.owner_id && user.id != params.userId) {
  //     return response.status(401).send({
  //       message:
  //         "you're not the team owner and the giver user id isn't your user id",
  //     });
  //   }

  //   await team.loadMany({
  //     schoolLists: (b) =>
  //       b
  //         .where("date_time", ">=", from)
  //         .where("date_time", "<=", to)
  //         .with("studentPresences", (builder) => {
  //           builder.where("user_id", params.userId);
  //         }),
  //     employeePresences: (b) =>
  //       b
  //         .where("ended_at", ">=", from)
  //         .where("started_at", "<=", to)
  //         .with("studentPresences", (builder) => {
  //           builder.where("user_id", params.userId);
  //         }),
  //   });
  //   const schoolLists = team.getRelated("schoolLists");
  //   const employeePresences = team.getRelated("employeePresences");
  //   return { schoolLists, employeePresences };
  // }
}

module.exports = TeamController;
