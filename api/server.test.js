// Write your tests here
const request = require("supertest");
const server = require("./server.js");
const db = require("../data/dbConfig.js");

describe("auth router", () => {
  describe("POST /api/auth/register", () => {
    beforeEach(async () => {
      await db("users").truncate();
    });

    test("adds a new user to the database", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ password: "password", username: "abc" });

      const [user] = await db("users");
      expect(user.username).toBe("abc");
    });

    test("returns a 201", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ password: "password", username: "abcde" });
      console.log(res);
      expect(res.status).toBe(201);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await db("users").truncate();
    });

    test("successful login with a token return", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ password: "password", username: "abc" });

      const { token } = res.body;
      expect(token).toBeTruthy();
    });

    test("returns a 200", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ password: "password", username: "abcde" });
      console.log(res);
      expect(res.status).toBe(200);
    });
  });
});
