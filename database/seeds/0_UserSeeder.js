"use strict";

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const User = use("App/Models/User");

const users = {
  school: {
    admin: {
      name: "prof",
      email: "teacher@email.com",
      password: "password",
      role: "admin",
    },
    participants: [
      {
        name: "student 1",
        email: "s1@email.com",
        password: "password",
      },
      {
        name: "student 2",
        email: "s2@email.com",
        password: "password",
      },
      {
        name: "student 3",
        email: "s3@email.com",
        password: "password",
      },
    ],
  },
  bussiness: {
    admin: {
      name: "boss",
      email: "boss@email.com",
      password: "password",
      role: "admin",
    },
    participants: [
      {
        name: "employee 1",
        email: "e1@email.com",
        password: "password",
      },
      {
        name: "employee 2",
        email: "e2@email.com",
        password: "password",
      },
      {
        name: "employee 3",
        email: "e3@email.com",
        password: "password",
      },
    ],
  },
};

class UserSeeder {
  async run() {
    // const users =
    await User.create(users.school.admin);
    await User.create(users.bussiness.admin);
    // await User.create(user.bussiness.admin);
    const students = users.school.participants.map((user) => User.create(user));
    const employees = users.bussiness.participants.map((user) =>
      User.create(user)
    );
    const res = await Promise.all([...students, employees]);
    console.log("UserSeeder", res);
  }
}

module.exports = UserSeeder;
