"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Justification extends Model {
  user() {
    return this.belongsTo("App/Models/User");
  }

  teams() {
    return this.belongsTo("App/Models/Team");
  }
}

module.exports = Justification;
