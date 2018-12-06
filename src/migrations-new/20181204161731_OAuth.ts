import * as Knex from "knex";

exports.up = (knex: Knex): Promise<any> => {
  return Promise.all([
    knex.schema.createTable("o_auth_client", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("secret").notNullable();
      // table.arra

      table.text("description").nullable();
      table
        .boolean("done")
        .notNullable()
        .defaultTo(false);
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
    }),
    knex.schema.createTable("o_auth_refresh_token", table => {
      table
        .string("refreshToken")
        .notNullable()
        .primary();
      table.text("scope").notNullable();
      table.timestamp("refreshTokenExpiresAt").notNullable();

      table.integer("userId").notNullable();
      table
        .foreign("userId")
        .references("id")
        .inTable("user")
        .onDelete("cascade");

      table.uuid("clientId").notNullable();
      table
        .foreign("clientId")
        .references("id")
        .inTable("o_auth_client")
        .onDelete("cascade");
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
    }),
  ]);
};

exports.down = (knex: Knex): Promise<any> => {
  return Promise.all([knex.schema.dropTable("o_auth_refresh_token"), knex.schema.dropTable("o_auth_client")]);
};
