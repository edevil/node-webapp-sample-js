import { app } from "@app/app";
import * as request from "supertest";
import { router } from "@app/routes";
import * as CSRF from "csrf";
import { Connection, createConnection, getConnectionOptions, getRepository } from "typeorm";
import { logger } from "@app/logger";
import { User } from "@app/entities/user";

let conn: Connection;
beforeAll(async () => {
  const connectionOptions = Object.assign(await getConnectionOptions(), {
    database: "sample_db_test",
    synchronize: true, // TODO is this needed with the conn.synchronize below?
    dropSchema: true,
  });
  try {
    conn = await createConnection(connectionOptions);
  } catch (err) {
    logger.error("Could not create connection", {error: err});
    throw err;
  }
});

afterAll(async () => await conn.close());

beforeEach(async () => {
  await conn.synchronize(true);
});

describe("GET / - simple test", () => {
  it("Hello API request", async () => {
    const result = await request(app.callback()).get(router.url("index"));
    expect(result.text).toContain("Sample node app");
    expect(result.status).toEqual(200);
  });
});

describe("User registration tests", () => {
  it("GET user registration page", async () => {
    const result = await request(app.callback()).get(router.url("auth-register"));
    expect(result.text).toContain("Sample node app");
    expect(result.status).toEqual(200);
  });

  it("POST successful user registration", async () => {
    CSRF.prototype.verify = jest.fn(() => true);
    const username = "teste1";
    const password = "teste12345";
    const result = await request(app.callback())
      .post(router.url("auth-register"))
      .type("form")
      .send({ username: username, password: password, password_confirmation: password })
      .set("csrf-token", "test");

    expect(result.status).toEqual(302);
    expect(result.header["location"]).toEqual(router.url("index"));

    const repository = getRepository(User);
    const user = await repository.findOne({ username });
    expect(user).toBeDefined();
  });
});
