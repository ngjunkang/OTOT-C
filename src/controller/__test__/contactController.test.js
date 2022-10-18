const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const supertest = require("supertest");
const server = require("../../server");

const app = server.createExpressServer();

const expectedName = "Ng Jun Kang";
const expectedEmail = "ngjunkang@test.com";
const expectGender = "male";
const expectedPhone = "98765432";
const validMongoIdObj = "6326cc5c8afa4620bb4c81f2";
const newName = "new name";
const newEmail = "newEmail@gmail.com";
let validId = "";

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  mongoose.disconnect();
  mongoose.connection.close();
  await new Promise((resolve) => setTimeout(() => resolve(), 2000));
});

describe("GET requests", () => {
  test("Returns Express root route", async () => {
    const { statusCode, text } = await supertest(app).get("/");
    expect(text).toBe("Hello World with Express (CD activated)");
    expect(statusCode).toBe(200);
  });
  test("Returns all contacts", async () => {
    const { statusCode, body } = await supertest(app).get("/api/contacts");
    expect(statusCode).toBe(200);
    expect(body.status).toBe("success");
    expect(body.message).toBe("Contacts retrieved successfully");
  });
  test("Returns invalid route", async () => {
    const { statusCode, body } = await supertest(app).get("/api/contacts2");
    expect(statusCode).toBe(404);
    expect(body.status).toBe("error");
    expect(body.message).toBe("invalid api route!");
  });
});

describe("POST contact", () => {
  test("Returns success (valid contact)", async () => {
    const { statusCode, body } = await supertest(app)
      .post("/api/contacts")
      .send({
        name: expectedName,
        email: expectedEmail,
        gender: expectGender,
        phone: expectedPhone,
      });
    expect(statusCode).toBe(200);
    expect(body.message).toBe("New contact created!");
    expect(body.status).toBe("success");
    const { _id, name, email, gender, phone } = body.data;
    validId = _id;
    expect(name).toBe(expectedName);
    expect(email).toBe(expectedEmail);
    expect(gender).toBe(expectGender);
    expect(phone).toBe(expectedPhone);
  });
  test("Returns error (missing name)", async () => {
    const { statusCode, body } = await supertest(app)
      .post("/api/contacts")
      .send({
        email: expectedEmail,
        gender: expectGender,
        phone: expectedPhone,
      });
    expect(statusCode).toBe(400);
    expect(body.message).toBe("Missing name/email!");
    expect(body.status).toBe("error");
  });
  test("Returns error (missing email)", async () => {
    const { statusCode, body } = await supertest(app)
      .post("/api/contacts")
      .send({
        name: expectedName,
        gender: expectGender,
        phone: expectedPhone,
      });
    expect(statusCode).toBe(400);
    expect(body.message).toBe("Missing name/email!");
    expect(body.status).toBe("error");
  });
  test("Returns error (missing name and email)", async () => {
    const { statusCode, body } = await supertest(app)
      .post("/api/contacts")
      .send({
        gender: expectGender,
        phone: expectedPhone,
      });
    expect(statusCode).toBe(400);
    expect(body.message).toBe("Missing name/email!");
    expect(body.status).toBe("error");
  });
});

describe("GET contact", () => {
  test("Returns success, GET valid contact", async () => {
    const { statusCode, body } = await supertest(app).get(
      `/api/contacts/${validId}`
    );
    expect(statusCode).toBe(200);
    expect(body.status).toBe("success");
    expect(body.message).toBe("Contact details loading..");
    const { _id, name, email, gender, phone } = body.data;
    expect(_id).toBe(validId);
    expect(name).toBe(expectedName);
    expect(email).toBe(expectedEmail);
    expect(gender).toBe(expectGender);
    expect(phone).toBe(expectedPhone);
  });
  test("Returns error, GET invalid contact (does not exist)", async () => {
    const { statusCode, body } = await supertest(app).get(
      `/api/contacts/${validMongoIdObj}`
    );
    expect(statusCode).toBe(404);
    expect(body.status).toBe("error");
    expect(body.message).toBe(
      `cannot find contact with contact_id ${validMongoIdObj}`
    );
  });
  test("Returns error, GET invalid contact (invalid id)", async () => {
    const { statusCode, body } = await supertest(app).get("/api/contacts/123");
    expect(statusCode).toBe(400);
    expect(body.status).toBe("error");
    expect(body.message).toBe("invalid contact_id!");
  });
});

describe("PUT contact", () => {
  test("Returns success, PUT valid contact", async () => {
    const { statusCode, body } = await supertest(app)
      .put(`/api/contacts/${validId}`)
      .send({
        name: newName,
        email: newEmail,
      });
    expect(statusCode).toBe(200);
    expect(body.status).toBe("success");
    expect(body.message).toBe("Contact Info updated");
    const { _id, name, email, gender, phone } = body.data;
    expect(_id).toBe(validId);
    expect(name).toBe(newName);
    expect(email).toBe(newEmail);
    expect(gender).toBe(expectGender);
    expect(phone).toBe(expectedPhone);
  });
  test("Returns error, PUT invalid contact (does not exist)", async () => {
    const { statusCode, body } = await supertest(app)
      .put(`/api/contacts/${validMongoIdObj}`)
      .send({
        name: newName,
        email: newEmail,
      });
    expect(statusCode).toBe(404);
    expect(body.status).toBe("error");
    expect(body.message).toBe(
      `cannot find contact with contact_id ${validMongoIdObj}`
    );
  });
  test("Returns error, PUT invalid contact (invalid id)", async () => {
    const { statusCode, body } = await supertest(app)
      .put("/api/contacts/123")
      .send({
        name: newName,
        email: newEmail,
      });
    expect(statusCode).toBe(400);
    expect(body.status).toBe("error");
    expect(body.message).toBe("invalid contact_id!");
  });
});

describe("DELETE contact", () => {
  test("Returns success, DELETE valid contact", async () => {
    const { statusCode, body } = await supertest(app).delete(
      `/api/contacts/${validId}`
    );
    expect(statusCode).toBe(200);
    expect(body.status).toBe("success");
    expect(body.message).toBe("Contact deleted");

    const res = await supertest(app).get(`/api/contacts/${validId}`);
    expect(res.statusCode).toBe(404);
  });
  test("Returns error, DELETE invalid contact (invalid id)", async () => {
    const { statusCode, body } = await supertest(app).delete(
      "/api/contacts/123"
    );
    expect(statusCode).toBe(400);
    expect(body.status).toBe("error");
    expect(body.message).toBe("invalid contact_id!");
  });
});
