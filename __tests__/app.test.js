const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const _ = require("lodash");

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

describe("GET /api/invalidPath", () => {
  test("404: not found when querying a non-existent path", () => {
    return request(app)
      .get("/api/hajsdfbhjasdbfvja")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
});

describe("GET /api/reviews", () => {
  test("200: should return an array of review objects with the correct properties", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: should return a list of all reviews sorted by date in descending by default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: allows client to filter by category and returns a list of all reviews in that category, sorted by date in descending by default", () => {
    return request(app)
      .get("/api/reviews?category=social deduction")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toHaveLength(11);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: "social deduction",
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });

  test("200: should return an empty array if category exists but has no reviews ", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toHaveLength(0);
      });
  });

  test("200: allows client to filter by category and sort by a specific column and order, and returns a list of all reviews in that category, sorted by the column and order specified", () => {
    return request(app)
      .get("/api/reviews?category=social deduction&sort_by=title&order=desc")
      .expect(200)
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("title", { descending: true });
      });
  });
  test("200: allows client to sort reviews by any column and returns a list of all reviews sorted by that column", () => {
    return request(app)
      .get("/api/reviews?sort_by=title")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("title", { descending: true });
      });
  });
  test("200: allows client to sort reviews by any column and choose the order and returns a list of all reviews sorted by that column in the specific order", () => {
    return request(app)
      .get("/api/reviews?sort_by=title&order=asc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("title");
      });
  });

  test("400: bad request when invalid query term for sort", () => {
    return request(app)
      .get("/api/reviews?sort_by=banana")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request: Cannot sort by 'banana'");
      });
  });
  test("400: bad request when invalid query term for order", () => {
    return request(app)
      .get("/api/reviews?sort_by=title&order=desc;DROPTABLES")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request: Cannot order in 'desc;DROPTABLES'");
      });
  });
  test("400: bad request when invalid query term for category", () => {
    return request(app)
      .get("/api/reviews?category=banana")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request: Category 'banana' does not exist");
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200: should return a review object ", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
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
          })
        );
      });
  });

  test("200: should return a review object, with correct properties, including comment count ", () => {
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
          comment_count: 0,
        });
      });
  });

  test("404: not found when review_id does not exist", () => {
    return request(app)
      .get("/api/reviews/100")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found: Review '100' does not exist");
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

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: should return an array of comments for the given review_id, with the correct properties", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("200:return comments sorted by date in descending order, by default", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: should return an empty array if review id exists but has no comments ", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(0);
      });
  });

  test("404: should return not found if review id does not exist", () => {
    return request(app)
      .get("/api/reviews/100/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found: Review '100' does not exist");
      });
  });
  test("400: bad request when wrong data type inputed in the params ", () => {
    return request(app)
      .get("/api/reviews/hello/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("201: should add new comment to review id and return posted comment", () => {
    const newCommentToAdd = {
      username: "mallionaire",
      body: "I loved this game",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newCommentToAdd)
      .expect(201)
      .then(({ body: { newComment } }) => {
        expect(newComment).toEqual({
          comment_id: 7,
          votes: 0,
          created_at: expect.any(String),
          author: "mallionaire",
          body: "I loved this game",
          review_id: 1,
        });
      });
  });
  test("404: not found, when author is non existent", () => {
    const newCommentToAdd = {
      username: "sanaGubari",
      body: "I loved this game",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newCommentToAdd)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("400: bad request, when not all required properties posted", () => {
    const newCommentToAdd = {
      body: "I loved this game",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newCommentToAdd)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("404: not found when review_id does not exist", () => {
    const newCommentToAdd = {
      username: "mallionaire",
      body: "I loved this game",
    };
    return request(app)
      .post("/api/reviews/100/comments")
      .send(newCommentToAdd)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("400: bad request when wrong data type inputed in the params ", () => {
    const newCommentToAdd = {
      username: "mallionaire",
      body: "I loved this game",
    };
    return request(app)
      .post("/api/reviews/hello/comments")
      .send(newCommentToAdd)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: no content when comment has been deleted", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(undefined);
      });
  });
  test("404: not found when id not present in table", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found: Comment '100' does not exist");
      });
  });
  test("400: bad request when wrong data type is inputted for comment_id ", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("200: should increment selected review's votes by the given number and return the updated review", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/1")
      .send(newVote)
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual({
          review_id: 1,
          title: "Agricola",
          review_body: "Farmyard fun!",
          designer: "Uwe Rosenberg",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 2,
          category: "euro game",
          owner: "mallionaire",
          created_at: "2021-01-18T10:00:20.514Z",
        });
      });
  });
  test("200: should decrement selected review's votes by the given number and return the updated review", () => {
    const newVote = { inc_votes: -1 };
    return request(app)
      .patch("/api/reviews/1")
      .send(newVote)
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual({
          review_id: 1,
          title: "Agricola",
          review_body: "Farmyard fun!",
          designer: "Uwe Rosenberg",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 0,
          category: "euro game",
          owner: "mallionaire",
          created_at: "2021-01-18T10:00:20.514Z",
        });
      });
  });
  test("200: selected review's votes should stay the same if no new votes added ", () => {
    const newVote = { inc_votes: 0 };
    return request(app)
      .patch("/api/reviews/1")
      .send(newVote)
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
  test("400: bad request, when incorrect property posted", () => {
    const newVote = { votes: 1 };
    return request(app)
      .patch("/api/reviews/1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("404: not found when review_id does not exist", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/1000")
      .send(newVote)

      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found: Review '1000' does not exist");
      });
  });

  test("400: bad request when wrong data type inputed in the params ", () => {
    const newVote = { inc_votes: "banana" };
    return request(app)
      .patch("/api/reviews/1")
      .send(newVote)

      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("GET/api", () => {
  test("200: should return a JSON describing all the available endpoints on the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints["GET /api"]).toEqual({
          description:
            "serves up a json representation of all the available endpoints of the api",
        });
        expect(Object.keys(endpoints)).toEqual(
          expect.arrayContaining([
            "GET /api",
            "GET /api/categories",
            "GET /api/reviews",
            "GET /api/reviews/:review_id",
            "GET /api/reviews/:review_id/comments",
            "POST /api/reviews/:review_id/comments",
            "DELETE /api/comments/:comment_id",
            "PATCH /api/reviews/:review_id",
          ])
        );
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: should return a user object with the correct properties", () => {
    return request(app)
      .get("/api/users/mallionaire")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual(
          expect.objectContaining({
            username: "mallionaire",
            name: "haz",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          })
        );
      });
  });
  test("404: not found when username does not exist", () => {
    return request(app)
      .get("/api/users/sana")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found: Username 'sana' does not exist");
      });
  });
});

describe("GET /api/comments/:comment_id", () => {
  test("200: should return a specific comment object with the right properties ", () => {
    return request(app)
      .get("/api/comments/1")
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: 1,
            body: "I loved this game too!",
            votes: 16,
            author: "bainesface",
            review_id: 2,
            created_at: "2017-11-22T12:43:33.389Z",
          })
        );
      });
  });

  test("404: not found when comment_id does not exist", () => {
    return request(app)
      .get("/api/comments/100")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found: Comment '100' does not exist");
      });
  });
  test("400: bad request when wrong data type is queried", () => {
    return request(app)
      .get("/api/comments/banana")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: should increment selected comment's votes by the given number and return the updated comment", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 1,
          body: "I loved this game too!",
          votes: 17,
          author: "bainesface",
          review_id: 2,
          created_at: "2017-11-22T12:43:33.389Z",
        });
      });
  });
  test("200: should decrement selected review's votes by the given number and return the updated review", () => {
    const newVote = { inc_votes: -1 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 1,
          body: "I loved this game too!",
          votes: 15,
          author: "bainesface",
          review_id: 2,
          created_at: "2017-11-22T12:43:33.389Z",
        });
      });
  });
  test("200: selected comments votes should stay the same if no new votes added ", () => {
    const newVote = { inc_votes: 0 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 1,
          body: "I loved this game too!",
          votes: 16,
          author: "bainesface",
          review_id: 2,
          created_at: "2017-11-22T12:43:33.389Z",
        });
      });
  });
  test("400: bad request, when incorrect property posted", () => {
    const newVote = { votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("404: not found when comment_id does not exist", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1000")
      .send(newVote)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found: Comment '1000' does not exist");
      });
  });

  test("400: bad request when wrong data type inputed in the params ", () => {
    const newVote = { inc_votes: "banana" };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});

describe("POST /api/reviews", () => {
  test("201: should add a new review and return posted review", () => {
    const newReviewToAdd = {
      owner: "philippaclaire9",
      title: "Hungry Hungry Hippos",
      review_body: "Such a fun game to play",
      designer: "Fred Kroll",
      category: "children's games",
    };
    return request(app)
      .post("/api/reviews")
      .send(newReviewToAdd)
      .expect(201)
      .then(({ body: { newReview } }) => {
        expect(newReview).toEqual(
          expect.objectContaining({
            comment_count: 0,
            owner: "philippaclaire9",
            title: "Hungry Hungry Hippos",
            review_id: 14,
            category: "children's games",
            created_at: expect.any(String),
            votes: 0,
            designer: "Fred Kroll",
            review_body: "Such a fun game to play",
          })
        );
      });
  });

  test("404: not found, when owner is non existent", () => {
    const newReviewToAdd = {
      owner: "sanaGubari",
      title: "Hungry Hungry Hippos",
      review_body: "Such a fun game to play",
      designer: "Fred Kroll",
      category: "children's games",
    };
    return request(app)
      .post("/api/reviews")
      .send(newReviewToAdd)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("404: Not found, when category is non existent", () => {
    const newReviewToAdd = {
      owner: "philippaclaire9",
      title: "Hungry Hungry Hippos",
      review_body: "Such a fun game to play",
      designer: "Fred Kroll",
      category: "fun",
    };
    return request(app)
      .post("/api/reviews")
      .send(newReviewToAdd)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("400: bad request, when not all required properties posted", () => {
    const newReviewToAdd = {
      owner: "sanaGubari",
      review_body: "Such a fun game to play",
      designer: "Fred Kroll",
      category: "children's games",
    };
    return request(app)
      .post("/api/reviews")
      .send(newReviewToAdd)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});
