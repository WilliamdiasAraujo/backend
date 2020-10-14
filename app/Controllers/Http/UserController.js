"use strict";

const User = use("App/Models/User");

class UserController {
  //
  async index() {
    const users = await User.all();

    return users;
  }

  async store({ request }) {
    const data = request.only(["name", "password", "email", "role"]);

    const user = await User.create(data);

    return user;
  }

  async login({ request, response, auth }) {
    try {
      const { email, password } = request.all();

      const token = await auth.attempt(email, password);
      const user = await User.query().where("email", "=", email).first();

      return { user, token };
    } catch (error) {
      return response.status(500).send({ error });
    }
  }

  async update({ request, auth }) {
    try {
      const data = request.only(["name", "password", "email"]);
      const user = auth.user;
      user.merge(data);
      await user.save();
      return user;
    } catch (error) {
      return response.status(500).send({ error });
    }
  }

  async destroy({ response, auth }) {
    const user = auth.user;
    await user.delete();
    return response
      .status(200)
      .send({ message: "the authenticated user was deleted" });
  }
}

module.exports = UserController;
