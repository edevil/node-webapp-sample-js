exports.up = (knex) => {
  return Promise.all([
    knex.raw('create extension if not exists "uuid-ossp"'),
    knex.raw('create extension if not exists "unaccent"'),
    knex.raw("DROP TEXT SEARCH CONFIGURATION IF EXISTS pt"),
    knex.raw("CREATE TEXT SEARCH CONFIGURATION pt ( COPY = portuguese )"),
    knex.raw(
      "ALTER TEXT SEARCH CONFIGURATION pt ALTER MAPPING FOR hword, hword_part, word WITH unaccent, portuguese_stem",
    ),
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
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
    }),
  ]);
};

exports.down = (knex) => {
  return Promise.all([
    knex.schema.dropTable("card"),
    knex.raw("DROP TEXT SEARCH CONFIGURATION pt"),
    knex.raw('drop extension if exists "uuid-ossp"'),
    knex.raw('drop extension if exists "unaccent"'),
  ]);
};
