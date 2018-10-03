import { app } from "app";
import * as request from "supertest";

describe("GET / - simple test", () => {
  it("Hello API request", async () => {
    const result = await request(app).get("/");
    expect(result.text).toEqual("teste");
    expect(result.statusCode).toEqual(200);
  });
});
