/* eslint-disable func-names */
exports.up = function(knex) {
  return knex.schema.createTable("User", table => {
    table.string("user_name");
    table.integer("zipcode");
    table.string("best1");
    table.string("best2");
    table.string("best3");
    table.string("best4");
    table.string("best5");
    table.string("best6");
    table.string("best7");
    table.string("best8");
    table.string("best9");
    table.string("best10");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("User");
};
