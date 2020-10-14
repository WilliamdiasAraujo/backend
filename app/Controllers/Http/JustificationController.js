"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Helpers = use("Helpers");
const Justification = use("App/Models/Justification");
const Team = use("App/Models/Team");
/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use("Env");

class JustificationController {
  async index({ params }) {
    const team = await Team.find(params.teamId);
    const justifications = await team.justifications().with("user").fetch();
    return justifications;
  }

  async store({ request, response, auth, params }) {
    const user = auth.user;
    const data = request.only(["message"]);
    const file = request.file("media", {
      types: ["image"],
      size: "10mb",
    });
    const filePath = `uploads/user/${user.id}`;
    const fileName = `justification-${new Date().getTime()}.${file.subtype}`;
    await file.move(Helpers.tmpPath(filePath), {
      name: fileName,
      overwrite: true,
    });
    if (!file.moved()) {
      response.send({ error: file.error });
    }

    const media_url = `${Env.get("APP_URL")}/${filePath}/${file.fileName}`;
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
    const justification = await Justification.find(params.justificationId);
    justification.merge({ status: "accepted" });
    await justification.save();
    return justification;
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
