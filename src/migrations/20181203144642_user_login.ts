import * as Knex from "knex";

exports.up = (knex: Knex): Promise<any> => {
  return Promise.all([
    knex.schema.createTable("user", table => {
      table.increments("id");
      table
        .string("username")
        .nullable()
        .unique();
      table.string("password").nullable();
      table
        .string("email")
        .notNullable()
        .unique();
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
    }),
    knex.schema.createTable("social_login", table => {
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
      table
        .string("clientId")
        .notNullable()
        .unsigned();
      table.integer("userId").notNullable();
      table.enu("type", ["Google", "Twitter", "0", "1"], { useNative: true, enumName: "social_login_type_enum" });
      table.unique(["type", "clientId"]);
      table
        .foreign("userId")
        .references("id")
        .inTable("user")
        .onDelete("cascade");
      table.primary(["type", "userId"]);
    }),
  ]);
};

exports.down = (knex: Knex): Promise<any> => {
  return Promise.all([
    knex.schema.dropTable("social_login"),
    knex.raw('DROP TYPE "social_login_type_enum"'),
    knex.schema.dropTable("user"),
  ]);
};
