const { Customer, sequelize } = require("../models");
const { queryInterface } = sequelize;
const request = require("supertest");
const app = require("../app");
let token;

beforeAll(async () => {
  await Customer.destroy({ truncate: true, cascade: true, restartIdentity: true });
  // await News.destroy({ truncate: true, cascade: true, restartIdentity: true });
  let dataNews = require("../data/news.json");
  dataNews.forEach((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
  });
  // await QueryInterface.bulkInsert("News", dataNews);
  // await queryInterface.bulkInsert("News", dataNews, {});
});

describe("POST /customers/register", () => {
  describe("POST /customers/register Success Test!", () => {
    //Berhasil register
    it("Register success!", async () => {
      const payload = {
        username: "IcanGans",
        password: "12345",
        address: "bogor",
        phoneNumber: "010101010101",
        email: "ican@gmail.com",
      };
      const res = await request(app).post("/customers/register").send(payload);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("id", expect.any(Number));
      expect(res.body).toHaveProperty("email");
      expect(res.body).toHaveProperty("email", expect.any(String));
    });
  });
  describe("POST /customers/register Failed Test!", () => {
    // Email tidak diberikan / tidak diinput
    it("Email is null!", async () => {
      const payload = {
        username: "IcanGans",
        password: "12345",
        address: "bogor",
        phoneNumber: "010101010101",
        email: null,
      };
      const res = await request(app).post("/customers/register").send(payload);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("message", expect.arrayContaining(["Email is required"]));
    });
    // Password tidak diberikan / tidak diinput
    it("Password is null", async () => {
      const payload = {
        username: "IcanGans",
        password: null,
        address: "bogor",
        phoneNumber: "010101010101",
        email: "apalah@gmail.com",
      };
      const res = await request(app).post("/customers/register").send(payload);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("message", expect.arrayContaining(["Password is required"]));
    });
    // Email diberikan string kosong
    it("Email is undefined", async () => {
      const payload = {
        username: "IcanGans",
        password: "adadad",
        address: "bogor",
        phoneNumber: "010101010101",
        email: undefined,
      };
      const res = await request(app).post("/customers/register").send(payload);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("message", expect.arrayContaining(["Email is required"]));
    });
    // Password diberikan string kosong
    it("Password is required!", async () => {
      const payload = {
        username: "IcanGans",
        password: undefined,
        address: "bogor",
        phoneNumber: "010101010101",
        email: "apalah@gmail.com",
      };
      const res = await request(app).post("/customers/register").send(payload);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("message", expect.arrayContaining(["Password is required"]));
    });
    // Email sudah terdaftar
    it("Email must be unique!", async () => {
      const payload = {
        username: "IcanGans",
        password: "adadad",
        address: "bogor",
        phoneNumber: "010101010101",
        email: "ican@gmail.com",
      };
      const res = await request(app).post("/customers/register").send(payload);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("message", expect.stringContaining("email must be unique"));
    });
    // Format Email salah / invalid
    it("Email format isn't right!", async () => {
      const payload = {
        username: "IcanGans",
        password: "adadad",
        address: "bogor",
        phoneNumber: "010101010101",
        email: "icanblagmail.com",
      };
      const res = await request(app).post("/customers/register").send(payload);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("message", expect.arrayContaining(["Your email format isn't right"]));
    });
  });
});

describe("POST /customers/login", () => {
  describe("POST /customers/login Success Test!", () => {
    // Berhasil login
    it("Login success!", async () => {
      const payload = {
        email: "ican@gmail.com",
        password: "12345",
      };
      const res = await request(app).post("/customers/login").send(payload);
      token = res.body.access_token;
      //.set('access_token', token)
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("message", expect.stringContaining("Login successfull"));
      expect(res.body).toHaveProperty("username");
      expect(res.body).toHaveProperty("username", expect.stringContaining("IcanGans"));
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("id", expect.any(Number));
      expect(res.body).toHaveProperty("access_token");
      expect(res.body).toHaveProperty("access_token", expect.stringContaining(token));
    });
  });

  describe("POST /customers/login Failed Test!", () => {
    // Memberikan password yang salah
    it("Password is wrong!", async () => {
      const payload = {
        email: "ican@gmail.com",
        password: "123456",
      };
      const res = await request(app).post("/customers/login").send(payload);
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("message", expect.stringContaining("Invalid username or email or password"));
    });
    // Email yang diinput tidak terdaftar di database
    it("Email is not registered!", async () => {
      const payload = {
        email: "albert@gmail.com",
        password: "12345",
      };
      const res = await request(app).post("/customers/login").send(payload);
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("message", expect.stringContaining("Invalid username or email or password"));
    });
  });
});

describe("GET /news/cust", () => {
  describe("GET /news/cust Success Test!", () => {
    //Berhasil mendapatkan Entitas Utama (baik tanpa atau dengan access_token) tanpa menggunakan query filter parameter
    it("Login success!", async () => {
      const payload = {
        email: "ican@gmail.com",
        password: "12345",
      };
      const res = await request(app).post("/customers/login").send(payload);
      token = res.body.access_token;
      //.set('access_token', token)
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("message", expect.stringContaining("Login successfull"));
      expect(res.body).toHaveProperty("username");
      expect(res.body).toHaveProperty("username", expect.stringContaining("IcanGans"));
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("id", expect.any(Number));
      expect(res.body).toHaveProperty("access_token");
      expect(res.body).toHaveProperty("access_token", expect.stringContaining(token));
    });
    // [ ] Berhasil mendapatkan Entitas Utama (baik tanpa atau dengan access_token) dengan 1 query filter parameter
    // [ ] Berhasil mendapatkan  Entitas Utama (baik tanpa atau dengan access_token) dengan 3 query filter parameter
    // [ ] Berhasil mendapatkan  Entitas Utama serta panjang yang sesuai (baik tanpa atau dengan access_token) ketika memberikan page tertentu (cek paginationnya)
    // [ ] Berhasil mendapatkan 1  Entitas Utama sesuai dengan params id yang diberikan
    // [ ] Gagal mendapatkan Entitas Utama karena params id yang diberikan tidak ada di database / invalid
  });

  describe("POST /customers/login Failed Test!", () => {
    // Memberikan password yang salah
    it("when password is invalid", async () => {
      const res = await request(app).post("/customers/login").send({ email: "ican@gmail.com", password: "1234" });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
      expect(res.body.msg).toContain("invalid email or password");
    });
    //   it("Password is wrong!", async () => {
    //     const payload = {
    //       email: "ican@gmail.com",
    //       password: "123456",
    //     };
    //     const res = await request(app).post("/customers/login").send(payload);
    //     expect(res.statusCode).toBe(401);
    //     expect(res.body).toHaveProperty("message");
    //     expect(res.body).toHaveProperty("message", expect.stringContaining("Invalid username or email or password"));
    //   });
    //   // Email yang diinput tidak terdaftar di database
    //   it("Email is not registered!", async () => {
    //     const payload = {
    //       email: "albert@gmail.com",
    //       password: "12345",
    //     };
    //     const res = await request(app).post("/login/cust").send(payload);
    //     expect(res.statusCode).toBe(401);
    //     expect(res.body).toHaveProperty("message");
    //     expect(res.body).toHaveProperty("message", expect.stringContaining("Invalid username or email or password"));
    //   });
  });
});
