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
      .then(({ body: { categories } }) => {
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

describe("GET /api/reviews/:review_id", () => {
  test("200: should return a review object, with correct properties: ", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual({
          review_id: 1,
          title: "Agricola",
          review_body: "Farmyard fun!",
          designer: "Uwe Rosenberg",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 1,
          category: "euro game",
          owner: "mallionaire",
          created_at: "2021-01-18T10:00:20.514Z",
        });
      });
  });
  test("404: not found when review_id does not exist", () => {
    return request(app)
      .get("/api/reviews/100")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("400: bad request when wrong data type is queried", () => {
    return request(app)
      .get("/api/reviews/banana")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("/api/invalidPath", () => {
  test("404: not found when querying a non-existent path", () => {
    return request(app)
      .get("/api/hajsdfbhjasdbfvja")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found, invalid path.");
      });
  });
});
