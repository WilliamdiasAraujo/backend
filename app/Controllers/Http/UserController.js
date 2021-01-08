"use strict";

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use("Hash");

const User = use("App/Models/User");
const Env = use("Env");
const Mail = use("Mail");

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

  async forgot({ request }) {
    const { email } = request.only(["email"]);
    // console.log("bo");
    const user = await User.query().where("email", "=", email).first();

    if (!user) {
      return response.status(400).send({ msg: "Usuário não cadastrado" });
    }

    const randomNumber = (Math.random() * Math.pow(10, 6)).toFixed(0);
    user.confirmation_code = randomNumber;
    await user.save();

    try {
      await Mail.send("emails.forgot", user.toJSON(), (message) => {
        console.log("start");
        message
          // .to(user.email)
          .to("hebertoliveira@infojr.com.br")
          .from(Env.get("MAIL_USERNAME", ""))
          .subject("Welcome to yardstick");
        console.log("end");
      });
      console.log("end!");
      return { msg: "send" };
    } catch (err) {
      console.log({ err });
    }
  }

  async changePassword({ request }) {
    const { email, confirmation_code, new_password } = request.only([
      "confirmation_code",
      "email",
      "new_password",
    ]);

    const user = await User.query().where("email", "=", email).first();

    if (!user) {
      return response.status(400).send({ msg: "Usuário não cadastrado" });
    }

    if (user.confirmation_code !== confirmation_code) {
      return response.status(401).send({ msg: "Inválido" });
    }

    user.password = new_password;
    user.confirmation_code = null;
    await user.save();
    return { msg: "Senha atualizada" };
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
