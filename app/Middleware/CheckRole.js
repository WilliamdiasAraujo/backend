"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CheckRole {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth, response }, next, props) {
    if (props.every((role) => role !== auth.user.role)) {
      return response
        .status(401)
        .send({ message: "the given user is not a admin" });
    }
    await next();
  }
}

module.exports = CheckRole;
