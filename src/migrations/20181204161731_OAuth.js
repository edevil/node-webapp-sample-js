exports.up = (knex) => {
  return Promise.all([
    knex.schema.createTable("o_auth_client", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("secret").notNullable();
      table.specificType("redirectUris", "text array").notNullable();
      table.specificType("grants", "text array").notNullable();
      table.specificType("scopes", "text array").notNullable();
      table.integer("userId").notNullable();
      table
        .foreign("userId")
        .references("id")
        .inTable("user")
        .onDelete("cascade");
      table
        .timestamp("createdAt")
        .defaultTo(knex.fn.now())
        .notNullable();
      table
        .timestamp("updatedAt")
        .defaultTo(knex.fn.now())
        .notNullable();
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
      table
        .timestamp("createdAt")
        .defaultTo(knex.fn.now())
        .notNullable();
      table
        .timestamp("updatedAt")
        .defaultTo(knex.fn.now())
        .notNullable();
    }),
    knex.schema.createTable("o_auth_authorization_code", table => {
      table
        .string("authorizationCode")
        .notNullable()
        .primary();
      table.timestamp("expiresAt").notNullable();
      table.text("redirectUri").notNullable();
      table.text("scope").notNullable();
      table
        .timestamp("createdAt")
        .defaultTo(knex.fn.now())
        .notNullable();
      table
        .timestamp("updatedAt")
        .defaultTo(knex.fn.now())
        .notNullable();

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
    }),
    knex.schema.createTable("o_auth_access_token", table => {
      table
        .string("accessToken")
        .notNullable()
        .primary();
      table.text("scope").notNullable();
      table.timestamp("accessTokenExpiresAt").notNullable();
      table
        .timestamp("createdAt")
        .defaultTo(knex.fn.now())
        .notNullable();
      table
        .timestamp("updatedAt")
        .defaultTo(knex.fn.now())
        .notNullable();

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
    }),
  ]);
};

exports.down = (knex) => {
  return Promise.all([
    knex.schema.dropTable("o_auth_access_token"),
    knex.schema.dropTable("o_auth_authorization_code"),
    knex.schema.dropTable("o_auth_refresh_token"),
    knex.schema.dropTable("o_auth_client"),
  ]);
};
