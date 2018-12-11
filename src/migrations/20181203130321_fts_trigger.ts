import * as Knex from "knex";

exports.up = (knex: Knex): Promise<any> => {
  return Promise.all([
    knex.raw(
      `CREATE TRIGGER card_search_update BEFORE INSERT OR UPDATE ON "card" FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger("searchVector", 'public.pt', title, description)`,
    ),
  ]);
};

exports.down = (knex: Knex): Promise<any> => {
  return Promise.all([knex.raw('DROP TRIGGER "card_search_update" ON "card"')]);
};
