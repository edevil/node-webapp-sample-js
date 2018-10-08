import { app } from "@app/app";
import * as request from "supertest";
import { router } from "@app/routes";
import * as CSRF from "csrf";
import { Connection, createConnection, getConnectionOptions, getRepository } from "typeorm";
import { logger } from "@app/logger";
import { User } from "@app/entities/user";
import { CreateUser } from "@app/dtos/create-user";
import { createUser } from "@app/service";

let conn: Connection;
beforeAll(async () => {
  const connectionOptions = Object.assign(await getConnectionOptions(), {
    database: "sample_db_test",
  });
  try {
    conn = await createConnection(connectionOptions);
  } catch (err) {
    logger.error("Could not create connection", { error: err });
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

describe("User login/logout tests", () => {
  it("GET user login page", async () => {
    const result = await request(app.callback()).get(router.url("auth-login"));
    expect(result.text).toContain("Sample node app");
    expect(result.status).toEqual(200);
  });

  it("successful login/logout dance", async () => {
    CSRF.prototype.verify = jest.fn(() => true);
    const agent = request.agent(app.callback());

    // GET logout, ensure redirect
    const rLogoutRedir = await agent.get(router.url("auth-logout"));
    console.log(`Set Cookie: ${JSON.stringify(rLogoutRedir.header["set-cookie"])}`);
    expect(rLogoutRedir.header["location"]).toEqual(router.url("auth-login"));
    expect(rLogoutRedir.status).toEqual(302);

    // manually create user
    const username = "teste1";
    const password = "teste12345";
    let createReq: CreateUser = new CreateUser();
    createReq.username = username;
    createReq.password = password;
    const user = await createUser(createReq, getRepository(User));

    // POST login
    const rLogin = await agent
      .post(router.url("auth-login"))
      .type("form")
      .send({ username: username, password: password })
      .set("csrf-token", "test");

    expect(rLogin.status).toEqual(302);
    expect(rLogin.header["location"]).toEqual(router.url("auth-logout"));

    // ensure GET logout is successful
    const rLogout = await agent.get(router.url("auth-logout"));
    expect(rLogout.text).toContain("Sample node app");
    expect(rLogout.status).toEqual(200);

    // POST logout

    // GET logout -> redir
  });
});
