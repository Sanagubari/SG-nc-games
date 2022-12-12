const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");

afterAll(() => {
    if (db.end) db.end();
});

beforeEach(() => seed(testData));

describe("GET /api/categories", () => {
  test("200: should return an array of category objects with the correct properties", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("/api/invalidPath", () => {
    test("404: not found when querying a non-existent path", () => {
      return request(app)
        .get("/api/hajsdfbhjasdbfvja")
        .expect(404)
        .then(({ body }) => {
            console.log(body)
          const { msg } = body;
          expect(msg).toBe("Not found, invalid path.");
        });
    });
  });
