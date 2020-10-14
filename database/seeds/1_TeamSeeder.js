"use strict";

/*
|--------------------------------------------------------------------------
| TeamSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Team = use("App/Models/Team");
// const User = use("App/Models/User");

class TeamSeeder {
  async run() {
    const teams = [
      {
        owner_id: 1,
        name: "schoolar team 1",
        address: "random place for a college",
        type: "school",
      },
      {
        owner_id: 2,
        name: "bussiness team 1",
        address: "random place for a bussiness",
        type: "bussiness",
      },
    ];

    const studentsIds = [2, 3, 4, 5];
    const employeesIds = [3, 4, 7, 8];

    const process = teams.map((team) => Team.create(team));
    const res = await Promise.all(process);
    const associateProcess1 = studentsIds.map(async (id) => {
      return await res[0].users().attach(id);
    });
    const associateProcess2 = employeesIds.map(async (id) => {
      return await res[1].users().attach(id);
    });
    const associateRes = await Promise.all([
      ...associateProcess1,
      ...associateProcess2,
    ]);
    console.log("TeamSeeder", { res, associateRes });
  }
}

module.exports = TeamSeeder;
