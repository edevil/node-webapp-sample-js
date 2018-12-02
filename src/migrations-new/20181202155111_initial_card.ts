import * as Knex from "knex";

exports.up = (knex: Knex): Promise<any> => {
  return Promise.all([
    knex.raw('create extension if not exists "uuid-ossp"'),
    knex.raw('create extension if not exists "unaccent"'),
    knex.schema.createTable("card", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("title").notNullable();
      table.text("description").nullable();
      table
        .boolean("done")
        .notNullable()
        .defaultTo(false);
      table.specificType("searchVector", "tsvector");
      table.index("searchVector", null, "gin");
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = (knex: Knex): Promise<any> => {
  return Promise.all([
    knex.schema.dropTable("card"),
    knex.raw('drop extension if exists "uuid-ossp"'),
    knex.raw('drop extension if exists "unaccent"'),
  ]);
};
