import { app } from "@app/app";
import * as request from "supertest";

describe("GET / - simple test", () => {
  it("Hello API request", async () => {
    const result = await request(app.callback()).get("/");
    expect(result.text).toContain("Sample node app");
    expect(result.status).toEqual(200);
  });
});
