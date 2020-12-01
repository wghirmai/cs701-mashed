/* eslint-disable camelcase */
// eslint-disable-next-line
const { Model } = require("objection");

class Users extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "User";
  }

  // Objection.js assumes primary key is `id` by default

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "user_name",
        "zipcode",
        "best1",
        "best2",
        "best3",
        "best4",
        "best5",
        "best6",
        "best7",
        "best8",
        "best9",
        "best10"
      ],

      properties: {
        user_name: { type: "string" },
        zipcode: { type: "string" },
        best1: { type: "string" },
        best2: { type: "string" },
        best3: { type: "string" },
        best4: { type: "string" },
        best5: { type: "string" },
        best6: { type: "string" },
        best7: { type: "string" },
        best8: { type: "string" },
        best9: { type: "string" },
        best10: { type: "string" }
      }
    };
  }
}

module.exports = Users;
